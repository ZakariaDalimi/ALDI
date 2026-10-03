import { Check, Heart, ListPlus } from "lucide-react";
import type { Product } from "@/api/discountedProducts";
import { useProductLists } from "./ProductListsContext";

interface Props {
  product: Product;
  className?: string;
}

const ProductActions = ({ product, className = "" }: Props) => {
  const { favorites, shoppingList, toggleFavorite, toggleShoppingList } = useProductLists();
  const isFavorite = favorites.some((item) => item.productId === product.productId);
  const isInShoppingList = shoppingList.some((item) => item.productId === product.productId);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => toggleFavorite(product)}
        aria-label={isFavorite ? "Aus Merkliste entfernen" : "In Merkliste speichern"}
        aria-pressed={isFavorite}
        title={isFavorite ? "Aus Merkliste entfernen" : "In Merkliste speichern"}
        className="grid size-10 place-items-center border border-gray-200 bg-white text-primary shadow-sm transition-colors hover:text-secondary"
      >
        <Heart size={19} fill={isFavorite ? "currentColor" : "none"} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => toggleShoppingList(product)}
        aria-label={isInShoppingList ? "Aus Einkaufsliste entfernen" : "Zur Einkaufsliste hinzufügen"}
        aria-pressed={isInShoppingList}
        title={isInShoppingList ? "Aus Einkaufsliste entfernen" : "Zur Einkaufsliste hinzufügen"}
        className="grid size-10 place-items-center border border-gray-200 bg-white text-primary shadow-sm transition-colors hover:text-secondary"
      >
        {isInShoppingList ? (
          <Check size={19} aria-hidden="true" />
        ) : (
          <ListPlus size={19} aria-hidden="true" />
        )}
      </button>
    </div>
  );
};

export default ProductActions;