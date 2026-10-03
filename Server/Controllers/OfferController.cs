namespace Server.Controllers;

using Microsoft.AspNetCore.Mvc;
using Server.Data;
using Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json.Nodes;
using Server.Services;

[Route("api/v1/[controller]")]
[ApiController]
public class OfferController(ApplicationDbContext context, OffersService offersImportService) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;
    private readonly OffersService _offersImportService = offersImportService;


    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll()
    {
        var data = await _context.Products
            .Where(p => p.IsDiscount == true)
            .ToListAsync();
        if (data == null) return NotFound();

        return Ok(data);
    }



    [HttpGet("import")]
    public async Task<IActionResult> ImportOffers()
    {
        return await _offersImportService.ImportOffersFromApi();
    }


}
