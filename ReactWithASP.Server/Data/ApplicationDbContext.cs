using Microsoft.EntityFrameworkCore;
using ReactwithASP.Server.Models;
using ReactWithASP.Server.Models;

namespace ReactWithASP.Server.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) 
        : base(options)
    {
    }

    public DbSet<Product> Products { get; set; }

    public DbSet<Category> Categories { get; set; }
}