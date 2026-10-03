import Hero from "../../Components/Hero";
import { slideData } from "../../Test/MockData";
import Grid from "../../Components/Grid";
import Cards from "../../Components/Cards";
import { Link } from "react-router-dom";
import { ArrowRight, Heart, ShoppingBasket } from "lucide-react";
import { useProductLists } from "@/Components/ProductListsContext";

const Root = () => {
  const { shoppingList, favorites } = useProductLists();

  return (
    <>
      <Hero slides={slideData} />
      <Grid />
      <section className="mb-12 bg-primary-container text-white">
        <div className="flex flex-col gap-8 px-page-desktop py-9 md:flex-row md:items-center md:justify-between md:py-12">
          <div className="max-w-xl">
            <p className="mb-2 text-sm font-semibold uppercase text-tertiary-fixed-dim">
              Dein Einkauf, gut geplant
            </p>
            <h2 className="text-2xl font-bold md:text-3xl">
              Alles für den nächsten Einkauf an einem Ort.
            </h2>
            <p className="mt-3 max-w-lg text-white/75">
              Entdecke deine Favoriten und stell deine Einkaufsliste zusammen.
            </p>
            <Link
              to="/einkaufsliste"
              className="mt-5 inline-flex min-h-11 items-center bg-white px-4 font-semibold text-primary transition-colors hover:bg-secondary-container hover:text-white"
            >
              Einkauf planen <ArrowRight className="ml-3" size={18} aria-hidden="true" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 border-t border-white/20 pt-6 md:min-w-72 md:border-l md:border-t-0 md:pl-8 md:pt-0">
            <div>
              <ShoppingBasket size={21} aria-hidden="true" className="mb-3 text-secondary-fixed-dim" />
              <p className="text-3xl font-bold">{shoppingList.length}</p>
              <p className="mt-1 text-sm text-white/70">Auf deiner Liste</p>
            </div>
            <div>
              <Heart size={21} aria-hidden="true" className="mb-3 text-secondary-fixed-dim" />
              <p className="text-3xl font-bold">{favorites.length}</p>
              <p className="mt-1 text-sm text-white/70">Gemerkte Produkte</p>
            </div>
          </div>
        </div>
      </section>
      <Cards />
    </>
  );
};

export default Root;