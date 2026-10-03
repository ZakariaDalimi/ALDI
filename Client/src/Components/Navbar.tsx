import { useEffect, useState } from "react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search, ShoppingBasket, X } from "lucide-react";
import { productSearchQuery } from "@/api/productSearch";
import { useProductLists } from "./ProductListsContext";

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
          {navLinks.map((item) => (
            <li className="text-headline-sm text-inverse-on-surface" key={item.title}>
              <NavLink
                className={({ isActive }) => isActive ? "nav-link nav-active" : "nav-link"}
                to={item.linkTo}
              >
                {item.title}
              </NavLink>
            </li>
          ))}
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
          if (!(nextTarget instanceof Node) || !event.currentTarget.contains(nextTarget)) {
            setSearchOpen(false);
          }
        }}
      >
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="flex h-11 items-center gap-2 border border-white/50 bg-white px-3 text-gray-900"
        >
          <Search size={18} aria-hidden="true" className="shrink-0 text-gray-500" />
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
                      <span className="block truncate font-medium">{product.name}</span>
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
