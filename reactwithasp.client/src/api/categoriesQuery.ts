import { useQuery } from "@tanstack/react-query";

export interface Category {
  categoryId: number;
  count: number;
  name: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
 const response = await fetch('http://localhost:5035/api/v1/Category');
 if (!response.ok) {
    throw new Error(`Failed to fetch categories:${response.statusText}`)
 }
 return response.json();
}

export const categoriesQuery = {
    queryKey:['categories'] as const, 
    queryFn: fetchCategories,
    staleTime: 100 * 60 * 5, // data stays fresh for 5 mins
}

 
