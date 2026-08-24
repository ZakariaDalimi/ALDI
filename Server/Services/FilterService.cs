using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Models;

namespace Server.Services;

public class FilterService(ApplicationDbContext context)
{
    
    public readonly ApplicationDbContext _context = context;



    public async Task<dynamic> SearchProducts(string name)
    {
        var products = await _context.Products
        .Where(p => EF.Functions.Like(p.Name, $"%{name}%") ||
                    EF.Functions.Like(p.Brand, $"%{name}%") ||
                    EF.Functions.Like(p.OfferSectionTitle, $"%{name}%")
        ).ToListAsync();

        return products;
    }



    public async Task<dynamic> FilterProducts(string sortByPrice)
    {
        IQueryable<Product> query = _context.Products;

            if(sortByPrice == "price_low")
            {
                query = query.OrderBy(p=> p.Price);
            }else
            {
                query = query.OrderByDescending(p=> p.OriginalPrice);
            }
            
        
        return await query.ToListAsync();
    }


}