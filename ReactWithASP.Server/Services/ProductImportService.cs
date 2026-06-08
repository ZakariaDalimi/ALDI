using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Data;

namespace ReactwithASP.Server.Services;


public class ProductImportService(ApplicationDbContext context)
{

    public readonly ApplicationDbContext _context = context;

    public async Task<bool> ImportCategory()
    {
        return true;
    }

   




    
}