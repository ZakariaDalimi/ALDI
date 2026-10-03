import { useQuery } from "@tanstack/react-query";

export interface Product {
  productId: number;
  price: number | null;
  name: string;
  imageUrl:string;
  isDiscount:boolean;
  salesUnit:string;
  originalPrice:number | null;
  offerCategory:string | null;
  offerSectionTitle:string | null;
  validityStart:string | null;
  validityEnd:string | null;
  brand?:string;
  OfferSectionTitle?:string;
  categories?: { categoryId: number; name: string }[];
}

export const fetchProducts = async (): Promise<Product[]> => {
 const response = await fetch('http://localhost:5035/api/v1/offer');
 if (!response.ok) {
    throw new Error(`Failed to fetch categories:${response.statusText}`)
 }
 return response.json();
}

export const productsQuery = {
    queryKey:['products'] as const, 
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000,
}

 
