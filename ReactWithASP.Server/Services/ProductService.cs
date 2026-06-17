using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Data;
using ReactWithASP.Server.Models;

namespace ReactwithASP.Server.Services;


public class ProductService(ApplicationDbContext context)
{

    public readonly ApplicationDbContext _context = context;

    public async Task<bool> ImportCategory()
    {
        return true;
    }


    public async Task<Product?> GetProductById( int productId)
    {
        return await _context.Products.FindAsync(productId);
    }
   



}