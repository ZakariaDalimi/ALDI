import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "@/api/discountedProducts";

interface ProductLists {
  favorites: Product[];
  shoppingList: Product[];
}

interface ProductListsContextValue extends ProductLists {
  toggleFavorite: (product: Product) => void;
  toggleShoppingList: (product: Product) => void;
}

const STORAGE_KEY = "aldi-product-lists";
const emptyLists: ProductLists = { favorites: [], shoppingList: [] };
const ProductListsContext = createContext<ProductListsContextValue | null>(null);

const readSavedLists = (): ProductLists => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyLists;

    const parsed = JSON.parse(saved) as Partial<ProductLists>;
    return {
      favorites: Array.isArray(parsed.favorites) ? parsed.favorites : [],
      shoppingList: Array.isArray(parsed.shoppingList) ? parsed.shoppingList : [],
    };
  } catch {
    return emptyLists;
  }
};

export const ProductListsProvider = ({ children }: { children: ReactNode }) => {
  const [lists, setLists] = useState<ProductLists>(readSavedLists);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  }, [lists]);

  const toggleFavorite = (product: Product) => {
    setLists((current) => ({
      ...current,
      favorites: current.favorites.some((item) => item.productId === product.productId)
        ? current.favorites.filter((item) => item.productId !== product.productId)
        : [...current.favorites, product],
    }));
  };

  const toggleShoppingList = (product: Product) => {
    setLists((current) => ({
      ...current,
      shoppingList: current.shoppingList.some((item) => item.productId === product.productId)
        ? current.shoppingList.filter((item) => item.productId !== product.productId)
        : [...current.shoppingList, product],
    }));
  };

  return (
    <ProductListsContext.Provider value={{ ...lists, toggleFavorite, toggleShoppingList }}>
      {children}
    </ProductListsContext.Provider>
  );
};

export const useProductLists = () => {
  const context = useContext(ProductListsContext);
  if (!context) throw new Error("useProductLists must be used inside ProductListsProvider");
  return context;
};