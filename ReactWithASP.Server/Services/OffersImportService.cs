using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.EntityFrameworkCore;
using ReactWithASP.Server.Data;
using ReactWithASP.Server.Models;

namespace ReactWithASP.Server.Services;



public class OffersImportService(ApplicationDbContext context)
{
    private readonly ApplicationDbContext _context = context;
    

    public async Task<bool> ImportOffers(JsonArray offersArray)
    {

        _context.Products.RemoveRange(_context.Products);
        await _context.SaveChangesAsync();

        await _context.Database.ExecuteSqlRawAsync("DELETE FROM sqlite_sequence WHERE name='Products';");


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


    

}