using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using BraidcodeDB.Data;
using BraidcodeDB.Models;

namespace BraidcodeDB
{
    public class Program
    {
        public static void Main(string[] args)
        {
            //InsertData();
            CreateHostBuilder(args).Build().Run();
        }
        private static void InsertData()
        {
            using (var context = new ClientsDbContext())
            {
                //var b = context.Database.EnsureCreated();

            }
        }
                public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
