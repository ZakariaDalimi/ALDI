namespace ReactWithASP.Server.Controllers;

using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Data;
using ReactWithASP.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json.Nodes;
using ReactwithASP.Server.Services;
using ReactWithASP.Server.Services;

[Route("api/v1/[controller]")]
[ApiController]
public class ProductController(ApplicationDbContext context, ProductImportService productImportService, IConfiguration configuration) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    private readonly IConfiguration _configuration = configuration;

    private readonly ProductImportService _productImportService = productImportService;


    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll()
    {
        var data = await _context.Products
            .Where(p => p.IsDiscount == false)
            .ToListAsync();
        return Ok(data);
    }

}