using System;
using BraidcodeDB.Models;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace BraidcodeDB.Data
{
    public class ClientsDbContext : DbContext
    {
        public DbSet<Client> Clients { get; set; }
        public DbSet<ClientRec> ClientRecs { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<RefreshToken> RefreshToken { get; set; }
        public DbSet<LoginsHistory> LoginsHistory { get; set; }
        public ClientsDbContext()
        {
            //var a = Database.CanConnect();
            //Database.EnsureDeleted();
            //var b = Database.EnsureCreated();
            //Database.Migrate();


        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseMySql("Your MySql connection string",
                opt=> opt.EnableRetryOnFailure(
                    maxRetryCount:10,
                    maxRetryDelay:TimeSpan.FromSeconds(30),
                    errorNumbersToAdd:null));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Client>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
            });
            modelBuilder.Entity<ClientRec>(entity =>
            {
                entity.HasKey(e => e.ClientRecId);
                entity.Property(e => e.ClientId).IsRequired();
                entity.HasOne(d => d.Client)
                  .WithMany(p => p.ClientRecs);
            });
            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.HasKey(e => e.iD);
                
            });
            modelBuilder.Entity<LoginsHistory>(entity =>
            {
                entity.HasKey(e => e.id);

            });
            
        }
    }
}
