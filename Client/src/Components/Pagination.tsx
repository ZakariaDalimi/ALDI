import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, pageSize, totalItems, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null;

  const firstVisiblePage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const lastVisiblePage = Math.min(totalPages, firstVisiblePage + 4);
  const pages = Array.from(
    { length: lastVisiblePage - firstVisiblePage + 1 },
    (_, index) => firstVisiblePage + index,
  );
  const firstItem = (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <nav
      aria-label="Seitennavigation"
      className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-5 sm:flex-row"
    >
      <p className="text-sm text-gray-600" aria-live="polite">
        Zeige {firstItem}–{lastItem} von {totalItems} Produkten
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Vorherige Seite"
          className="grid size-10 place-items-center border border-gray-300 text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-primary"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Seite ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={`grid size-10 place-items-center border text-sm font-semibold ${page === currentPage ? "border-primary bg-primary text-white" : "border-gray-300 text-primary hover:bg-gray-100"}`}
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Nächste Seite"
          className="grid size-10 place-items-center border border-gray-300 text-primary transition-colors hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-primary"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;