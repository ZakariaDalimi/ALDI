import { useState } from "react";
import { Link } from "react-router-dom";
import ProductActions from "@/Components/ProductActions";
import { useProductLists } from "@/Components/ProductListsContext";
import type { Product } from "@/api/discountedProducts";

type ListView = "shopping" | "favorites";

const formatPrice = (price: number | null) =>
  price === null
    ? "Preis nicht verfügbar"
    : new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(price);

const ShoppingLists = () => {
  const [activeView, setActiveView] = useState<ListView>("shopping");
  const { favorites, shoppingList } = useProductLists();
  const products: Product[] = activeView === "shopping" ? shoppingList : favorites;

  return (
    <main className="min-h-screen bg-surface px-page-desktop py-gutter-desktop">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <p className="mb-2 text-sm font-semibold uppercase text-secondary">Dein Einkauf</p>
        <h1 className="text-headline-lg text-on-primary-fixed-variant">Meine Listen</h1>
      </header>

      <div className="mb-8 inline-flex border-b border-gray-300" role="tablist" aria-label="Meine Listen">
        <button
          type="button"
          role="tab"
          aria-selected={activeView === "shopping"}
          onClick={() => setActiveView("shopping")}
          className={`min-h-12 border-b-2 px-5 font-semibold ${activeView === "shopping" ? "border-secondary text-primary" : "border-transparent text-gray-500"}`}
        >
          Einkaufsliste <span className="ml-2 text-sm">{shoppingList.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeView === "favorites"}
          onClick={() => setActiveView("favorites")}
          className={`min-h-12 border-b-2 px-5 font-semibold ${activeView === "favorites" ? "border-secondary text-primary" : "border-transparent text-gray-500"}`}
        >
          Merkliste <span className="ml-2 text-sm">{favorites.length}</span>
        </button>
      </div>

      {products.length === 0 ? (
        <div className="border-y border-gray-200 py-12 text-center">
          <h2 className="text-xl font-semibold text-on-primary-fixed-variant">
            {activeView === "shopping" ? "Deine Einkaufsliste ist noch leer" : "Noch keine gemerkten Produkte"}
          </h2>
          <p className="mt-2 text-gray-600">
            Speichere Produkte über das Herz- oder Listen-Symbol.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-flex min-h-11 items-center bg-primary px-5 font-semibold text-white hover:bg-secondary-container hover:text-on-secondary-container"
          >
            Produkte entdecken
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-gray-200 border-y border-gray-200">
          {products.map((product) => (
            <li key={product.productId} className="flex flex-wrap items-center gap-4 py-4">
              <Link to={`/offers/${product.productId}`} className="flex min-w-0 flex-1 items-center gap-4">
                <img
                  src={product.imageUrl}
                  alt=""
                  loading="lazy"
                  className="size-20 shrink-0 bg-white object-contain p-2"
                />
                <span className="min-w-0">
                  {product.brand && (
                    <span className="block text-xs uppercase text-gray-500">{product.brand}</span>
                  )}
                  <span className="block truncate font-semibold text-on-primary-fixed-variant">
                    {product.name}
                  </span>
                  <span className="mt-1 block text-sm text-gray-600">
                    {formatPrice(product.price)}{product.salesUnit ? ` · ${product.salesUnit}` : ""}
                  </span>
                </span>
              </Link>
              <ProductActions product={product} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

export default ShoppingLists;