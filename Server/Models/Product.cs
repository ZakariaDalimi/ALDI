using System.Text.Json.Serialization;

namespace Server.Models;

public class Product
{
    public int ProductId { get; set; } 
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string? Slug { get; set; }
    public decimal? Price { get; set; }
    public string SalesUnit { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    
    // Discount fields
    public bool IsDiscount { get; set; } = false; 
    public decimal? OriginalPrice { get; set; } 
    public DateTime? ValidityStart { get; set; }
    public DateTime? ValidityEnd { get; set; }
    public string? OfferCategory { get; set; }  
    public string? OfferSectionTitle { get; set; } 


    public List<Category> Categories { get;set; } = [] ;

} 