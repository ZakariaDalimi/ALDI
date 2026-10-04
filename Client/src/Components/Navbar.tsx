import { useEffect, useState } from "react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Search, ShoppingBasket, X } from "lucide-react";
import { productSearchQuery } from "@/api/productSearch";
import { useProductLists } from "./ProductListsContext";
import { productsQuery } from "@/api/discountedProducts";
import { categoriesQuery } from "@/api/categoriesQuery";
import {
  catalogProductsQuery,
  type ProductFilters,
} from "@/api/catalogProducts";

type PreviewMenu = "products" | "categories";
const emptyFilters: ProductFilters = {
  sortBy: "",
  categoryId: "",
  minPrice: "",
  maxPrice: "",
};

interface Props {
  navLinks: { title: string; linkTo: string }[];
}
const formatPrice = (price: number | null) =>
  price === null
    ? ""
    : new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
      }).format(price);

const Navbar = ({ navLinks }: Props) => {
  const { shoppingList } = useProductLists();
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<PreviewMenu | null>(null);
  const normalizedSearch = searchText.trim();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(normalizedSearch);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [normalizedSearch]);

  const {
    data: searchResults = [],
    isFetching,
    isError,
  } = useQuery({
    ...productSearchQuery(debouncedSearch),
    enabled: debouncedSearch.length >= 2,
  });

  const {
    data: previewProducts = [],
    isFetching: productsLoading,
    isError: productsFailed,
  } = useQuery({ ...productsQuery, enabled: activeMenu === "products" });
  const {
    data: categories = [],
    isFetching: categoriesLoading,
    isError: categoriesFailed,
  } = useQuery({ ...categoriesQuery, enabled: activeMenu === "categories" });
  const sortedCategories = [...categories].sort((first, second) =>
    first.name.localeCompare(second.name, "de"),
  );
  const categoryProductQueries = useQueries({
    queries: sortedCategories.map((category) => ({
      ...catalogProductsQuery({
        ...emptyFilters,
        categoryId: String(category.categoryId),
      }),
      enabled: activeMenu === "categories",
    })),
  });
  const previewCategories = sortedCategories
    .map((category, index) => ({
      category,
      products: categoryProductQueries[index]?.data ?? [],
    }))
    .filter(({ products }) => products.length > 0)
    .slice(0, 6);
  const previewCategoriesLoading =
    categoriesLoading ||
    categoryProductQueries.some((query) => query.isFetching);
  const previewCategoriesFailed =
    categoriesFailed || categoryProductQueries.some((query) => query.isError);

  const handleResultClick = () => {
    setSearchText("");
    setDebouncedSearch("");
    setSearchOpen(false);
  };

  return (
    <header className="flex flex-wrap items-center gap-gutter-desktop bg-tertiary-container px-page-desktop py-stack-sm">
      <Link to="/" aria-label="ALDI Startseite">
        <Logo />
      </Link>
      <nav className="min-w-0 flex-1 pl-stack-md" aria-label="Hauptnavigation">
        <ul className="flex flex-wrap gap-x-gutter-desktop">
          {navLinks.map((item) => {
            const previewMenu: PreviewMenu | null =
              item.linkTo === "/products"
                ? "products"
                : item.linkTo === "/categories"
                  ? "categories"
                  : null;

            return (
              <li
                className="relative text-headline-sm text-inverse-on-surface"
                key={item.title}
                onMouseEnter={() => setActiveMenu(previewMenu)}
                onMouseLeave={() => setActiveMenu(null)}
                onFocus={() => previewMenu && setActiveMenu(previewMenu)}
                onBlur={(event) => {
                  const nextTarget = event.relatedTarget;
                  if (
                    !(nextTarget instanceof Node) ||
                    !event.currentTarget.contains(nextTarget)
                  ) {
                    setActiveMenu(null);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setActiveMenu(null);
                }}
              >
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "nav-link nav-active" : "nav-link"
                  }
                  to={item.linkTo}
                  aria-haspopup={previewMenu ? "true" : undefined}
                  aria-expanded={
                    previewMenu ? activeMenu === previewMenu : undefined
                  }
                >
                  {item.title}
                </NavLink>

                {activeMenu === "products" && previewMenu === "products" && (
                  <div className="absolute left-0 top-full z-50 w-[min(520px,calc(100vw-2rem))] border border-gray-200 bg-white p-3 text-gray-900 shadow-xl">
                    <div className="mb-3 flex items-center justify-between gap-4">
                      <h2 className="font-semibold text-primary">
                        Aktuelle Produkte
                      </h2>
                      <Link
                        to="/products"
                        className="text-sm font-semibold text-secondary hover:underline"
                      >
                        Alle Produkte
                      </Link>
                    </div>
                    {productsLoading ? (
                      <p className="py-4 text-sm text-gray-600" role="status">
                        Produkte werden geladen ...
                      </p>
                    ) : productsFailed ? (
                      <p className="py-4 text-sm text-red-700" role="alert">
                        Produkte konnten nicht geladen werden.
                      </p>
                    ) : previewProducts.length === 0 ? (
                      <p className="py-4 text-sm text-gray-600">
                        Keine Produkte verfügbar.
                      </p>
                    ) : (
                      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {previewProducts.slice(0, 4).map((product) => (
                          <li key={product.productId}>
                            <Link
                              to={`/offers/${product.productId}`}
                              className="flex min-w-0 items-center gap-3 border border-gray-200 p-2 transition-colors hover:border-primary hover:bg-gray-50"
                            >
                              <img
                                src={product.imageUrl}
                                alt=""
                                loading="lazy"
                                className="size-14 shrink-0 object-contain"
                              />
                              <span className="min-w-0">
                                <span className="block line-clamp-2 text-sm font-medium">
                                  {product.name}
                                </span>
                                {product.price !== null && (
                                  <span className="mt-1 block text-sm font-bold text-primary">
                                    {formatPrice(product.price)}
                                  </span>
                                )}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {activeMenu === "categories" &&
                  previewMenu === "categories" && (
                    <div className="absolute left-0 top-full z-50 w-[min(520px,calc(100vw-2rem))] border border-gray-200 bg-white p-3 text-gray-900 shadow-xl">
                      <div className="mb-3 flex items-center justify-between gap-4">
                        <h2 className="font-semibold text-primary">
                          Kategorien entdecken
                        </h2>
                        <Link
                          to="/categories"
                          className="text-sm font-semibold text-secondary hover:underline"
                        >
                          Alle Kategorien
                        </Link>
                      </div>
                      {previewCategoriesLoading ? (
                        <p className="py-4 text-sm text-gray-600" role="status">
                          Kategorien werden geladen ...
                        </p>
                      ) : previewCategoriesFailed ? (
                        <p className="py-4 text-sm text-red-700" role="alert">
                          Kategorien konnten nicht geladen werden.
                        </p>
                      ) : previewCategories.length === 0 ? (
                        <p className="py-4 text-sm text-gray-600">
                          Keine Kategorien verfügbar.
                        </p>
                      ) : (
                        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {previewCategories.map(({ category, products }) => {
                            const image = products[0].imageUrl;
                            return (
                              <li key={category.categoryId}>
                                <Link
                                  to={`/categories/${category.categoryId}`}
                                  className="group flex min-w-0 items-center gap-3 border border-gray-200 p-2 transition-colors hover:border-primary hover:bg-gray-50"
                                >
                                  <div className="grid size-12 shrink-0 place-items-center bg-gray-100">
                                    {image && (
                                      <img
                                        src={image}
                                        alt=""
                                        loading="lazy"
                                        className="size-12 object-contain transition-transform duration-300 group-hover:scale-105"
                                      />
                                    )}
                                  </div>
                                  <span className="min-w-0 line-clamp-2 text-sm font-semibold">
                                    {category.name}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  )}
              </li>
            );
          })}
        </ul>
      </nav>

      <Link
        to="/einkaufsliste"
        className="inline-flex min-h-10 shrink-0 items-center gap-2 text-sm font-semibold text-white hover:text-secondary-fixed"
      >
        <ShoppingBasket size={19} aria-hidden="true" />
        <span>Einkaufsliste</span>
        <span className="grid min-w-6 place-items-center bg-secondary-container px-1.5 py-0.5 text-xs text-white">
          {shoppingList.length}
        </span>
      </Link>

      <div
        className="relative w-full max-w-sm"
        onBlur={(event) => {
          const nextTarget = event.relatedTarget;
          if (
            !(nextTarget instanceof Node) ||
            !event.currentTarget.contains(nextTarget)
          ) {
            setSearchOpen(false);
          }
        }}
      >
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="flex h-11 items-center gap-2 border border-white/50 bg-white px-3 text-gray-900"
        >
          <Search
            size={18}
            aria-hidden="true"
            className="shrink-0 text-gray-500"
          />
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setSearchOpen(false);
            }}
            placeholder="Produkte suchen"
            aria-label="Produkte suchen"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            aria-expanded={searchOpen && normalizedSearch.length >= 2}
            aria-controls="product-search-results"
            className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-gray-500"
          />
          {searchText && (
            <button
              type="button"
              onClick={() => {
                setSearchText("");
                setDebouncedSearch("");
                setSearchOpen(true);
              }}
              aria-label="Suche löschen"
              className="grid size-7 shrink-0 place-items-center text-gray-600 hover:text-black"
            >
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </form>

        {searchOpen && normalizedSearch.length >= 2 && (
          <ul
            id="product-search-results"
            role="listbox"
            aria-label="Suchergebnisse"
            className="absolute right-0 top-full z-50 mt-1 max-h-96 w-full overflow-y-auto border border-gray-200 bg-white text-gray-900 shadow-lg"
          >
            {debouncedSearch !== normalizedSearch || isFetching ? (
              <li className="px-4 py-3 text-sm text-gray-600" role="status">
                Suche läuft ...
              </li>
            ) : isError ? (
              <li className="px-4 py-3 text-sm text-red-700" role="alert">
                Suche derzeit nicht verfügbar.
              </li>
            ) : searchResults.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-600">
                Keine passenden Produkte gefunden.
              </li>
            ) : (
              searchResults.slice(0, 8).map((product) => (
                <li key={product.productId} role="option" aria-selected="false">
                  <Link
                    to={`/offers/${product.productId}`}
                    onClick={handleResultClick}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                  >
                    <img
                      src={product.imageUrl}
                      alt=""
                      loading="lazy"
                      className="size-12 shrink-0 object-contain"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {product.name}
                      </span>
                      {product.brand && (
                        <span className="block truncate text-xs text-gray-600">
                          {product.brand}
                        </span>
                      )}
                    </span>
                    {product.price !== null && (
                      <span className="shrink-0 text-sm font-semibold">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </Link>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </header>
  );
};

export default Navbar;
