using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using BraidcodeDB.Data;
using BraidcodeDB.Models;
using BraidcodeDB.Helpers;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace BraidcodeDB.Controllers
{
    //[ApiController]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("[controller]")]
    public class HomeController : Controller
    {
        private readonly ClientsDbContext _baseContext;
        private readonly IWebHostEnvironment _env;
        public HomeController( ClientsDbContext baseContext, IWebHostEnvironment env)
        {
            _baseContext = baseContext;
            _env = env;
        }
        [HttpGet]
        public IEnumerable<Client> Get()
        {
            //GenerateThumbsForAll();
            List<Client> data = _baseContext.Clients.ToList();
            
            return data;
        }

        [HttpPost]
        public async Task<IActionResult> Post(Client client, IFormFile Photo)
        {
            
            client.Id = Guid.NewGuid().ToString();
            client.ClientRecs = new List<ClientRec>();
            if (Photo != null)
            {
               
                client.Photo = await ClientFileSaveThumbGenerate(client, Photo);
            }
            _baseContext.Clients.Add(client);
            _baseContext.SaveChanges();
            return Ok(client);
        }
        [HttpPost]
        [Route("EditClient")]
        public async Task<IActionResult> EditClient(Client client, IFormFile Photo)
        {
            var webRoot = _env.WebRootPath;
            string FilePathForDB = client.Photo;
            if (Photo != null)
            {
                FilePathForDB = await ClientFileSaveThumbGenerate(client, Photo);
            }
            Client _client = _baseContext.Clients.Include(e => e.ClientRecs).FirstOrDefault(x => x.Id == client.Id);
           

            if (_client != null)
            {
                ClientRec[] ecords = _client.ClientRecs.Where(x => x.workPhoto == _client.Photo).ToArray();
                foreach (ClientRec rec in ecords)
                {
                    rec.workPhoto = FilePathForDB;
                }
                _client.Name = client.Name;
                _client.Phone = client.Phone;
                _client.Photo = FilePathForDB;
            }
            //_baseContext.Clients.Update(_client);
            _baseContext.SaveChanges();
            return Ok(client);
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var webRoot = _env.WebRootPath;
            Client client = _baseContext.Clients.Include(e => e.ClientRecs).FirstOrDefault(x => x.Id == id);
            if (client == null)
            {
                return NotFound();
            }
            string DirPath = "ClientImages/" + client.Id;
            string _filepath = System.IO.Path.Combine(webRoot, DirPath);
            if (Directory.Exists(_filepath))
            {
                Directory.Delete(_filepath, true);
            }
            _baseContext.Clients.Remove(client);
            _baseContext.SaveChanges();
            return Ok(client);
        }

        private async Task<string> ClientFileSaveThumbGenerate(Client client, IFormFile Photo)
        {
            var webRoot = _env.WebRootPath;
            string ReportFileExtention = new FileInfo(Photo.FileName).Extension;
            string fileName = client.Id + ReportFileExtention;
            string Filepath = "ClientImages/" + client.Id;

            string _filepath = System.IO.Path.Combine(webRoot, Filepath);
            string ThumbFilepath = _filepath + "/thumb";
            if (!Directory.Exists(_filepath))
            {
                Directory.CreateDirectory(_filepath);
                Directory.CreateDirectory(ThumbFilepath);
            }
            else
            {
                System.IO.DirectoryInfo directory = new System.IO.DirectoryInfo(_filepath);
                foreach (System.IO.FileInfo file in directory.GetFiles())
                    file.Delete();
                System.IO.DirectoryInfo ThumbDirectory = new System.IO.DirectoryInfo(ThumbFilepath);
                foreach (System.IO.FileInfo file in ThumbDirectory.GetFiles())
                    file.Delete();
            }
            string _filepathWithName = System.IO.Path.Combine(_filepath, fileName);
            string _ThumbfilepathWithName = System.IO.Path.Combine(ThumbFilepath, fileName);
            _ThumbfilepathWithName = System.IO.Path.Combine(webRoot, _ThumbfilepathWithName);

            using (var fileStream = new FileStream(_filepathWithName, FileMode.Create))
            {
                await Photo.CopyToAsync(fileStream);
                ThumbGenerator.GenerateThumb(_ThumbfilepathWithName, fileStream, 150);
            }
            return "/ClientImages/" + client.Id + "/" + fileName;

        }
        [HttpPost("{id}")]
        [Route("PostClientRec/{id}")]
        public async Task<IActionResult> PostClientRec(string id, ClientRec rec, IFormFile workPhoto)
        {
            var webRoot = _env.WebRootPath;
            Client _client = _baseContext.Clients.Include(b => b.ClientRecs).FirstOrDefault(x => x.Id == id);
            string RecId = Guid.NewGuid().ToString() + DateTime.UtcNow.ToString("ffff");
            string FilePathForDB = "";
            if (_client == null)
            {
                return NotFound();
            }
            if (workPhoto != null)
            {
                string ReportFileExtention = new FileInfo(workPhoto.FileName).Extension;
                string fileName = RecId + ReportFileExtention;
                string Filepath = "ClientImages/" + _client.Id + "/" + RecId;
                string _filepath = System.IO.Path.Combine(webRoot, Filepath);
                string ThumbFilepath = _filepath + "/thumb";
                if (!Directory.Exists(_filepath))
                {
                    Directory.CreateDirectory(_filepath);
                    Directory.CreateDirectory(ThumbFilepath);
                }
                else
                {
                    System.IO.DirectoryInfo directory = new System.IO.DirectoryInfo(_filepath);
                    foreach (System.IO.FileInfo file in directory.GetFiles())
                        file.Delete();
                    System.IO.DirectoryInfo ThumbDirectory = new System.IO.DirectoryInfo(ThumbFilepath);
                    foreach (System.IO.FileInfo file in ThumbDirectory.GetFiles())
                        file.Delete();
                }
                string _filepathWithName = System.IO.Path.Combine(_filepath, fileName);
                string _ThumbfilepathWithName = System.IO.Path.Combine(ThumbFilepath, fileName);
                _ThumbfilepathWithName = System.IO.Path.Combine(webRoot, _ThumbfilepathWithName);
                using (var fileStream = new FileStream(_filepathWithName, FileMode.Create))
                {
                    await workPhoto.CopyToAsync(fileStream);
                    ThumbGenerator.GenerateThumb(_ThumbfilepathWithName, fileStream, 150);
                }
                FilePathForDB = "/ClientImages/" + _client.Id + "/" + RecId + "/" + fileName;
            }
            else
            {
                FilePathForDB = _client.Photo;
            }
            _client.RecsCount++;
            ClientRec clientRec = new ClientRec()
            {
                ClientRecId = RecId,
                ClientId = _client.Id,
                workDate = rec.workDate,
                workColors = rec.workColors,
                workComment = rec.workComment,
                workSumm = rec.workSumm,
                workPhoto = FilePathForDB,
                workType = rec.workType,
                Client = _client
            };

            _client.ClientRecs.Add(clientRec);
            await _baseContext.SaveChangesAsync();
            //string jsonFormat = JsonSerializer.Serialize(_client);
            return Ok();
        }

        private void GenerateThumbsForAll()
        {
            var webRoot = _env.WebRootPath;
            foreach (Client client in _baseContext.Clients.ToList())
            {


                string _OrigFilepath = client.Photo;
                if (!_OrigFilepath.Contains("EmptyUserRound.png"))
                {
                    string OrigfileName = Path.GetFileName(_OrigFilepath);
                    string OrigpathFolder = _OrigFilepath.Remove((_OrigFilepath.LastIndexOf('/') + 1)) + "Thumb";

                    string ThumbDirpath = System.IO.Path.Combine(webRoot, OrigpathFolder.Remove(0, 1));
                    string ThumbFilePath = ThumbDirpath + '/' + OrigfileName;

                    if (!Directory.Exists(ThumbDirpath))
                    {
                        Directory.CreateDirectory(ThumbDirpath);
                    }
                    string OrigFullFilePath = System.IO.Path.Combine(webRoot, _OrigFilepath.Remove(0, 1));
                    using (var fileStream = new FileStream(OrigFullFilePath, FileMode.Open))
                    {
                        ThumbGenerator.GenerateThumb(ThumbFilePath, fileStream, 150);
                    }
                }
            }
            foreach (ClientRec rec in _baseContext.ClientRecs.ToList())
            {

                
                string _OrigFilepath = rec.workPhoto;
                string PhotoName = Path.GetFileNameWithoutExtension(_OrigFilepath);

                if (PhotoName!="EmptyUserRound" && PhotoName!=rec.ClientId)
                {
                    string OrigfileName = Path.GetFileName(_OrigFilepath);
                    string OrigpathFolder = _OrigFilepath.Remove((_OrigFilepath.LastIndexOf('/') + 1)) + "Thumb";

                    string ThumbDirpath = System.IO.Path.Combine(webRoot, OrigpathFolder.Remove(0, 1));
                    string ThumbFilePath = ThumbDirpath + '/' + OrigfileName;

                    if (!Directory.Exists(ThumbDirpath))
                    {
                        Directory.CreateDirectory(ThumbDirpath);
                    }
                    string OrigFullFilePath = System.IO.Path.Combine(webRoot, _OrigFilepath.Remove(0, 1));
                    using (var fileStream = new FileStream(OrigFullFilePath, FileMode.Open))
                    {
                        ThumbGenerator.GenerateThumb(ThumbFilePath, fileStream, 150);
                    }
                }
            }
        }

    }
}
