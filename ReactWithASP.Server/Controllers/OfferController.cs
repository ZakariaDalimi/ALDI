namespace ReactWithASP.Server.Controllers;

using Microsoft.AspNetCore.Mvc;
using ReactWithASP.Server.Data;
using ReactWithASP.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Text.Json.Nodes;
using ReactWithASP.Server.Services;

[Route("api/v1/[controller]")]
[ApiController]
public class OfferController(ApplicationDbContext context, OffersImportService offersImportService, IConfiguration configuration) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    private readonly IConfiguration _configuration = configuration;

    private readonly OffersImportService _offersImportService = offersImportService;


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
        using var client = new HttpClient();
        var apiKey = _configuration["ApiSettings:ApiKey"];
        var baseUrl = _configuration["ApiSettings:BaseUrl"];

        try
        {
            // discount for this week
            var request1 = new HttpRequestMessage(HttpMethod.Get, baseUrl + "get_current_offers");
            request1.Headers.Add("X-API-Key", apiKey);

            var response1 = await client.SendAsync(request1);
            if (!response1.IsSuccessStatusCode)
            {
                string errorContent = await response1.Content.ReadAsStringAsync();
                return StatusCode((int)response1.StatusCode, $"Fehler bei Woche 1: {errorContent}");
            }

            var jsonDoc1 = await response1.Content.ReadFromJsonAsync<JsonNode>();
            var array1 = jsonDoc1?["data"]?["offers"]?.AsArray();


            // discount for next week
            var request2 = new HttpRequestMessage(HttpMethod.Get, baseUrl + "get_next_week_offers");
            request2.Headers.Add("X-API-Key", apiKey);

            var response2 = await client.SendAsync(request2);
            if (!response2.IsSuccessStatusCode)
            {
                string errorContent = await response2.Content.ReadAsStringAsync();
                return StatusCode((int)response2.StatusCode, $"Fehler bei Woche 2: {errorContent}");
            }

            var jsonDoc2 = await response2.Content.ReadFromJsonAsync<JsonNode>();
            var array2 = jsonDoc2?["data"]?["offers"]?.AsArray();


            // combine offers in one array
            var combinedOffers = new JsonArray();
            if (array1 != null){foreach (var item in array1){combinedOffers.Add(item?.DeepClone());}}
            if (array2 != null){foreach (var item in array2){combinedOffers.Add(item?.DeepClone());}}


            if (combinedOffers.Count == 0)
            {
                return BadRequest("API response structure was invalid or empty.");
            }

            try
            {
                bool isImported = await _offersImportService.ImportOffers(combinedOffers);
                
                if (isImported)
                {
                    return Ok("Data successfully imported to database.");
                }
                else
                {
                    return Ok("Import skipped. The products are already saved or no new data was found.");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"There is an error while importing categories: {ex.Message}");
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Server error: {ex.Message}");
        }
    } 


}