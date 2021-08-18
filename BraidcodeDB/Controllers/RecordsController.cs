using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using System.Text.Json;
using BraidcodeDB.Data;
using BraidcodeDB.Models;
using BraidcodeDB.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace BraidcodeDB.Controllers
{
    [Authorize]
    [Route("[controller]")]
    public class RecordsController : Controller
    {
        private readonly ClientsDbContext _baseContext;
        private readonly IWebHostEnvironment _env;
        public RecordsController( ClientsDbContext baseContext, IWebHostEnvironment env)
        {
            _baseContext = baseContext;
            _env = env;
        }


        [HttpGet("{id}")]
        public IEnumerable<ClientRec> Get(string id)
        {
            List<ClientRec> data = _baseContext.ClientRecs.Where(x => x.ClientId == id).ToList();
            return data;
        }

        [HttpGet("GetUser/{id}")]
        public IActionResult GetUser(string id)
        {
            Client _client = _baseContext.Clients.FirstOrDefault(x => x.Id == id);
            return Ok(_client);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> Post(string id, ClientRec rec, IFormFile workPhoto)
        {
            var webRoot = _env.WebRootPath;
            if (id == null)
            {
                return BadRequest("id is Null!");
            }
            Client _client = _baseContext.Clients.Include(b => b.ClientRecs).FirstOrDefault(x => x.Id == id);
            string RecId = Guid.NewGuid().ToString() + DateTime.UtcNow.ToString("ffff");
            rec.ClientRecId = RecId;
            string FilePathForDB = "";
            if (_client == null)
            {
                return NotFound();
            }
            if (workPhoto != null)
            {
                FilePathForDB = await RecordFileSaveThumbGenerate(_client, rec, workPhoto);
            }
            else
            {
                FilePathForDB = rec.workPhoto;
            }
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
            _client.RecsCount++;
            _client.ClientRecs.Add(clientRec);
            _baseContext.SaveChanges();
            return Ok();
        }
        [HttpPost]
        [Route("Edit")]
        public async Task<IActionResult> Edit(ClientRec rec, IFormFile workPhoto)
        {
            var webRoot = _env.WebRootPath;
            string FilePathForDB = rec.workPhoto;
            Client _client = _baseContext.Clients.Include(b => b.ClientRecs).FirstOrDefault(x => x.Id == rec.ClientId);
            ClientRec clientRec = _baseContext.ClientRecs.FirstOrDefault(x => x.ClientRecId == rec.ClientRecId);
            if (workPhoto != null)
            {
                FilePathForDB = await RecordFileSaveThumbGenerate(_client, rec, workPhoto);
            }
            if (clientRec != null)
            {
                clientRec.workDate = rec.workDate;
                clientRec.workColors = rec.workColors;
                clientRec.workComment = rec.workComment;
                clientRec.workSumm = rec.workSumm;
                clientRec.workPhoto = FilePathForDB;
                clientRec.workType = rec.workType;
            }
            _baseContext.SaveChanges();
            return Ok(rec);
        }
        [HttpDelete("{id}")]
        public IActionResult Delete(string id)
        {
            var webRoot = _env.WebRootPath;
            ClientRec clientRec = _baseContext.ClientRecs.FirstOrDefault(x => x.ClientRecId == id);
            Client _client = _baseContext.Clients.Include(b => b.ClientRecs).FirstOrDefault(x => x.Id == clientRec.ClientId);
            string DirPath = "ClientImages/" + _client.Id + "/" + id;
            string _filepath = System.IO.Path.Combine(webRoot, DirPath);
            if (Directory.Exists(_filepath))
            {
                Directory.Delete(_filepath, true);
            }
            _baseContext.ClientRecs.Remove(clientRec);
            _client.ClientRecs.Remove(clientRec);
            if (_client.RecsCount != 0)
            {
                _client.RecsCount--;
            }

            _baseContext.SaveChanges();
            return Ok(clientRec);
        }
        private  async Task<string> RecordFileSaveThumbGenerate(Client _client, ClientRec rec, IFormFile workPhoto)
        {
            var webRoot = _env.WebRootPath;
            string ReportFileExtention = new FileInfo(workPhoto.FileName).Extension;
            string fileName = rec.ClientRecId + ReportFileExtention;
            string Filepath = "ClientImages/" + _client.Id + "/" + rec.ClientRecId;
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
            return "/ClientImages/" + _client.Id + "/" + rec.ClientRecId + "/" + fileName;

        }
    }

}
