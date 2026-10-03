using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Services;



public class OffersService(ApplicationDbContext context, IConfiguration configuration)
{
    private readonly ApplicationDbContext _context = context;
    private readonly IConfiguration _configuration = configuration;
    

    public async Task<bool> ImportOffers(JsonArray offersArray)
    {

        var nonDiscountedProducts = _context.Products.Where(p => p.IsDiscount == true);
        _context.Products.RemoveRange(nonDiscountedProducts);
        await _context.SaveChangesAsync();


        if(offersArray.Count == 0 || offersArray == null ) return false;

        int savedCount = 0;
        foreach (var item in offersArray)
        {
            var name =  item?["name"]?.ToString() ?? string.Empty;
            var brand =  item?["brand"]?.ToString() ?? string.Empty;
            var imageUrl = item?["image_url"]?.ToString() ?? string.Empty;
            var salesUnit = item?["sales_unit"]?.ToString() ?? string.Empty;
            decimal? price = item?["price"]?.GetValue<decimal>();

        

            if (string.IsNullOrEmpty(name) || 
                string.IsNullOrEmpty(brand) || 
                string.IsNullOrEmpty(imageUrl) ||
                price == null ||
                price <= 0m)
                
            {
                continue;
            }
                
            var newOffer = new Product
            {
                Name =  name,
                Brand =  brand,
                Slug = item?["slug"]?.ToString() ?? string.Empty,
                Price = (decimal?)(item?["price"]),
                SalesUnit = salesUnit,
                ImageUrl = imageUrl,
                // discount
                OriginalPrice = item?["original_price"]?.GetValue<decimal>() ?? 0m,
                OfferCategory = item?["offer_category"]?.ToString() ?? string.Empty,
                OfferSectionTitle = item?["offer_section_title"]?.ToString() ?? string.Empty,
                ValidityStart = (DateTime?) item?["validity_start"],
                ValidityEnd = (DateTime?)item?["validity_end"],
                IsDiscount = true
            };

            _context.Products.Add(newOffer);
            ++savedCount;
        }

        
        if (savedCount > 0)
        {
            await _context.SaveChangesAsync();
            return true; 
        }

            
       
       return false;
    }

    public async Task<IActionResult> ImportOffersFromApi()
    {
        using var client = new HttpClient();
        var apiKey = _configuration["ApiSettings:ApiKey"];
        var baseUrl = _configuration["ApiSettings:BaseUrl"];

        var nonDiscountedProducts = _context.Products.Where(p => p.IsDiscount == true);
        _context.Products.RemoveRange(nonDiscountedProducts);
        await _context.SaveChangesAsync();

        try
        {
            var request1 = new HttpRequestMessage(HttpMethod.Get, $"{baseUrl}get_current_offers");
            request1.Headers.Add("X-API-Key", apiKey);

            var response1 = await client.SendAsync(request1);
            if (!response1.IsSuccessStatusCode)
            {
                string errorContent = await response1.Content.ReadAsStringAsync();
                return new ObjectResult($"Fehler bei Woche 1: {errorContent}") { StatusCode = (int)response1.StatusCode };
            }

            var jsonDoc1 = await response1.Content.ReadFromJsonAsync<JsonNode>();
            var array1 = jsonDoc1?["data"]?["offers"]?.AsArray();

            var request2 = new HttpRequestMessage(HttpMethod.Get, baseUrl + "get_next_week_offers");
            request2.Headers.Add("X-API-Key", apiKey);

            var response2 = await client.SendAsync(request2);
            if (!response2.IsSuccessStatusCode)
            {
                string errorContent = await response2.Content.ReadAsStringAsync();
                return new ObjectResult($"Fehler bei Woche 2: {errorContent}") { StatusCode = (int)response2.StatusCode };
            }

            var jsonDoc2 = await response2.Content.ReadFromJsonAsync<JsonNode>();
            var array2 = jsonDoc2?["data"]?["offers"]?.AsArray();

            var combinedOffers = new JsonArray();
            if (array1 != null) { foreach (var item in array1) { combinedOffers.Add(item?.DeepClone()); } }
            if (array2 != null) { foreach (var item in array2) { combinedOffers.Add(item?.DeepClone()); } }

            if (combinedOffers.Count == 0)
            {
                return new BadRequestObjectResult("API response structure was invalid or empty.");
            }

            try
            {
                bool isImported = await ImportOffers(combinedOffers);

                if (isImported)
                {
                    return new OkObjectResult("Data successfully imported to database.");
                }

                return new OkObjectResult("Import skipped. The products are already saved or no new data was found.");
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult($"There is an error while importing categories: {ex.Message}");
            }
        }
        catch (Exception ex)
        {
            return new ObjectResult($"Server error: {ex.Message}") { StatusCode = 500 };
        }
    }

}