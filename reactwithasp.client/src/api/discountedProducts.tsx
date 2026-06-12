import { useQuery } from "@tanstack/react-query";

export interface Product {
  productId: number;
  price: number;
  name: string;
  imageUrl:string;
  isDiscount:boolean;
  salesUnit:string;
  originalPrice:number;
  offerCategory:string;
  offerSectionTitle:string;
  validityStart:string;
  validityEnd:string;
}

export const fetchProducts = async (): Promise<Product[]> => {
 const response = await fetch('http://localhost:5035/api/products');
 if (!response.ok) {
    throw new Error(`Failed to fetch categories:${response.statusText}`)
 }
 return response.json();
}

export const productsQuery = {
    queryKey:['products'] as const, 
    queryFn: fetchProducts,
    staleTime: 100 * 60 * 5, // data stays fresh for 5 mins
}

 
