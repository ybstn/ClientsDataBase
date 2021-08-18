using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using BraidcodeDB.Data;
using BraidcodeDB.Helpers;
using BraidcodeDB.Models;
using System.Security.Cryptography;
using TimeZoneConverter;
using System.Threading.Tasks;

namespace BraidcodeDB.Services
{
    public interface IUserService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress);
        AuthenticateResponse RefreshToken(string token, string ipAddress);
        bool RevokeToken(string token, string ipAddress);
        AppUser Create(AppUser user, string Inpassword);

        IEnumerable<AppUser> GetAll();
        AppUser GetById(string id);
    }
    public class UserService : IUserService
    {
        TimeZoneInfo _TimeZoneinfo = TZConvert.GetTimeZoneInfo("Russian Standard Time");
        private readonly AppSettings _appSettings;
        private readonly ClientsDbContext _baseContext;
        private readonly List<AppUser> _users;
        public UserService(IOptions<AppSettings> appSettings, ClientsDbContext baseContext)
        {
            _appSettings = appSettings.Value;
            _baseContext = baseContext;
            _users = baseContext.AppUsers.ToList();
        }
       
        public AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress)
        {
            
            var user = _users.SingleOrDefault(x => x.FullName == model.FullName);
            
            // return null if user not found
            if (user == null) return null;
            // check if password is correct
            if (!VerifyPasswordHash(model.Password, user.PasswordHash, user.PasswordSalt))
                return null;
            // authentication successful so generate jwt token
            var jwtToken = generateJwtToken(user);
            var refreshToken = generateRefreshToken(ipAddress);
         
            //if (!user.RefreshTokens.Contains(refreshToken))
            //{
                user.RefreshTokens.Add(refreshToken);
                _baseContext.AppUsers.Update(user);
            string nowDate = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, _TimeZoneinfo).ToString("dd.MM.yyyy HH:mm:ss");
            LoginsHistory logHist = new LoginsHistory()
                {
                id = Guid.NewGuid().ToString(),
                userName = user.FullName,
                loginDate = nowDate
                
            };
            _baseContext.LoginsHistory.Add(logHist);
                _baseContext.SaveChanges();
            //}

            return new AuthenticateResponse(user, jwtToken, refreshToken.Token);
        }
        public AppUser Create(AppUser user, string Inpassword)
        {
            // validation
            string password = Inpassword;
           byte[] passwordHash = null;
            byte[] passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            
            var id = Guid.NewGuid().ToString();
            user.iD = id;
            if (_baseContext.AppUsers.Any(x=> x.iD == user.iD || x.FullName == user.FullName))
            {
                _baseContext.AppUsers.Update(user);
            }
            else
            {
                
                _baseContext.AppUsers.Add(user);
            }
            
            _baseContext.SaveChanges();

            return user;
        }
        public AuthenticateResponse RefreshToken(string token, string ipAddress)
        {
           
            var user = _users.SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));

            // return null if no user found with token
            if (user == null) return null;

            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            // return null if token is no longer active
            if (!refreshToken.IsActive) return null;

            // replace old refresh token with a new one and save
            var newRefreshToken = generateRefreshToken(ipAddress);
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            refreshToken.ReplacedByToken = newRefreshToken.Token;
            user.RefreshTokens.Add(newRefreshToken);
            _baseContext.AppUsers.Update(user);
            _baseContext.SaveChanges();

            // generate new jwt
            var jwtToken = generateJwtToken(user);

            return new AuthenticateResponse(user, jwtToken, newRefreshToken.Token);
        }

        public bool RevokeToken(string token, string ipAddress)
        {
            var user = _users.SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));

            // return false if no user found with token
            if (user == null) return false;

            var refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            // return false if token is not active
            if (!refreshToken.IsActive) return false;

            // revoke token and save
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            _baseContext.AppUsers.Update(user);
            _baseContext.SaveChanges();

            return true;
        }

        private DateTime UnixTimeStampToDateTime(double unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToUniversalTime();
            return dtDateTime;
        }

        public IEnumerable<AppUser> GetAll()
        {
            return _users;
        }

        public AppUser GetById(string id)
        {
            return _users.FirstOrDefault(x => x.iD == id);
        }


        private string generateJwtToken(AppUser user)
        {
            // generate token that is valid for 7 days
            var tokenHandler = new JwtSecurityTokenHandler();

            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var signInkey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim("id", user.iD.ToString()) }),
                //Expires = DateTime.UtcNow.AddDays(7),
                Expires = DateTime.UtcNow.AddMinutes(1),
                SigningCredentials = new SigningCredentials(signInkey, SecurityAlgorithms.HmacSha256)
                //SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        private RefreshToken generateRefreshToken(string ipAddress)
        {
            using (var rngCryptoServiceProvider = new RNGCryptoServiceProvider())
            {
                var randomBytes = new byte[64];
                rngCryptoServiceProvider.GetBytes(randomBytes);
                return new RefreshToken
                {
                    iD = Guid.NewGuid().ToString(),
                    
                    Token = Convert.ToBase64String(randomBytes),
                    //Expires = DateTime.UtcNow.AddDays(7),
                    Expires = DateTime.UtcNow.AddMinutes(1),
                    Created = DateTime.UtcNow,
                    CreatedByIp = ipAddress
                };
            }
        }
       
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }
    }
}
