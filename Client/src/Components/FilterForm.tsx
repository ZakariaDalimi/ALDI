import { FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { Filter, RotateCcw } from "lucide-react";
import { categoriesQuery } from "@/api/categoriesQuery";
import { ProductFilters } from "@/api/catalogProducts";

interface Props {
  filters: ProductFilters;
  error?: string;
  onChange: (name: keyof ProductFilters, value: string) => void;
  onApply: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}

const FilterForm = ({ filters, error, onChange, onApply, onReset }: Props) => {
  const { data: categories = [] } = useQuery(categoriesQuery);

  return (
    <form onSubmit={onApply} className="border border-gray-200 bg-white p-5">
      <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-4">
        <h2 className="text-xl font-bold text-on-primary-fixed-variant">Filter</h2>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <RotateCcw aria-hidden="true" size={16} />
          Zurücksetzen
        </button>
      </div>

      <div className="grid gap-5">
        <label className="grid gap-2 text-sm font-medium">
          Sortieren nach
          <select
            value={filters.sortBy}
            onChange={(event) => onChange("sortBy", event.target.value)}
            className="min-h-11 border border-gray-300 bg-white px-3"
          >
            <option value="">Standard</option>
            <option value="name_asc">Name: A bis Z</option>
            <option value="name_desc">Name: Z bis A</option>
            <option value="price_asc">Preis: niedrig bis hoch</option>
            <option value="price_desc">Preis: hoch bis niedrig</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium">
          Kategorie
          <select
            value={filters.categoryId}
            onChange={(event) => onChange("categoryId", event.target.value)}
            className="min-h-11 border border-gray-300 bg-white px-3"
          >
            <option value="">Alle Kategorien</option>
            {categories.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="grid gap-2">
          <legend className="mb-2 text-sm font-medium">Preis (€)</legend>
          <div className="grid grid-cols-2 gap-3">
            <label className="grid gap-1 text-xs text-gray-600">
              Von
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.minPrice}
                onChange={(event) => onChange("minPrice", event.target.value)}
                placeholder="Min."
                className="min-h-11 w-full border border-gray-300 px-3 text-sm text-black"
              />
            </label>
            <label className="grid gap-1 text-xs text-gray-600">
              Bis
              <input
                type="number"
                min="0"
                step="0.01"
                value={filters.maxPrice}
                onChange={(event) => onChange("maxPrice", event.target.value)}
                placeholder="Max."
                className="min-h-11 w-full border border-gray-300 px-3 text-sm text-black"
              />
            </label>
          </div>
        </fieldset>

        {error && <p className="text-sm text-red-700" role="alert">{error}</p>}

        <button
          type="submit"
          className="inline-flex min-h-11 items-center justify-center gap-2 bg-primary px-4 font-semibold text-white hover:opacity-90"
        >
          <Filter aria-hidden="true" size={18} />
          Filter anwenden
        </button>
      </div>
    </form>
  );
};

export default FilterForm;
