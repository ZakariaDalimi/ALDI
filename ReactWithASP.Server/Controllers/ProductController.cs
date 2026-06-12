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

[Route("api/[controller]")]
[ApiController]
public class ProductsController(ApplicationDbContext context, ProductImportService productImportService, IConfiguration configuration) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    private readonly IConfiguration _configuration = configuration;

    private readonly ProductImportService _productImportService = productImportService;


    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll()
    {
        var data = await _context.Products.ToListAsync();
        return Ok(data);
    }


}