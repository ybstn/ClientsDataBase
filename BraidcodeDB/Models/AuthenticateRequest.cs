using System;
using System.ComponentModel.DataAnnotations;

namespace BraidcodeDB.Models
{
    public class AuthenticateRequest
    {
        [Required]
        public string FullName { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
