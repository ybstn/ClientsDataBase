using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace BraidcodeDB.Models
{
        public class Client
        {
            [Key]
            public string Id { get; set; }
            [Column(TypeName = "nvarchar(50)")]
            public string Name { get; set; }
            [Column(TypeName = "nvarchar(15)")]
            public string Phone { get; set; }
            [Column(TypeName = "nvarchar(150)")]
            public string Photo { get; set; }
            public int RecsCount { get; set; } = 0;
            public virtual ICollection<ClientRec> ClientRecs { get; set; }
        }
        public class ClientRec
        {
            [Key]
            public string ClientRecId { get; set; }
            public string ClientId { get; set; }
            public string workDate { get; set; }
            [Column(TypeName = "nvarchar(150)")]
            public string workPhoto { get; set; }
            [Column(TypeName = "nvarchar(50)")]
            public string workType { get; set; }
            [Column(TypeName = "nvarchar(100)")]
            public string workColors { get; set; }
            public string workSumm { get; set; }
            [Column(TypeName = "nvarchar(300)")]
            public string workComment { get; set; }

            public virtual Client Client { get; set; }
        }

    public class AppUser
    {
        [Key]
        public string iD { get; set; }
        public string FullName { get; set; }
        [DataType(DataType.Password)]
        [JsonIgnore]
        public byte[] PasswordHash { get; set; }
        [JsonIgnore]
        public byte[] PasswordSalt { get; set; }
        [JsonIgnore]
        public List<RefreshToken> RefreshTokens { get; set; }
    }

    [Owned]
    public class RefreshToken
    {
        [Key]
        [JsonIgnore]
        public string iD { get; set; }

        public string Token { get; set; }
        public DateTime Expires { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;
        public DateTime Created { get; set; }
        public string CreatedByIp { get; set; }
        public DateTime? Revoked { get; set; }
        public string RevokedByIp { get; set; }
        public string ReplacedByToken { get; set; }
        public bool IsActive => Revoked == null && !IsExpired;
    }

    public class LoginsHistory
    {
        [Key]
        public string id { get; set; }
        public string loginDate { get; set; }
        public string userName { get; set; }
    }
}
