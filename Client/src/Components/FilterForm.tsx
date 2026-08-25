import React from "react";
import { Product } from "../api/discountedProducts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { categoriesQuery } from "@/api/categoriesQuery";

interface Props {
  show?: boolean;
  data?: Product[] | undefined;
  filterParams?: {
    category: string;
    brand: string;
    sortType: string;
  }[];
}

const FilterForm: React.FC<Props> = ({ data, filterParams, show }) => {
  const { data: categories } = useQuery(categoriesQuery);
  const containerShow = show
    ? "opacity-100 pointer-events-auto"
    : "opacity-0 pointer-events-none";
  const formShow = show ? " translate-x-0" : "-translate-x-full";
  return (
    <div className={`absolute top-0 w-full min-h-full  ${containerShow}`} >
      <div className={`min-w-[40vh] h-full bg-white p-4 ${formShow}`}>
        <h3 className="text-3xl">Soriteren nach</h3>
        <select name="" id="">
          <option value="AZ">Name A bis Z</option>
          <option value="ZA">Name Z bis A</option>
          <option value="price-min">Preis (Niedrig bis Hoch)</option>
          <option value="price-max">Preis (Hoch bis Niedrig)</option>
        </select>
        <Accordion
          type="single"
          collapsible
          defaultValue="category"
          className="max-w-lg"
        >
          <AccordionItem value="category">
            <AccordionTrigger>
              <h3 className="text-2xl text-black font-bold">Kategorie</h3>
              <AccordionContent>
                <ul className="grid grid-cols-1 md:grid-cols-2">
                  {categories?.map((cat) => {
                    const { name, categoryId } = cat;
                    return (
                      <li key={categoryId} className="text-white grid place-items-center bg-blue-100 p-4 rounded-lg">
                         {name}
                      </li>
                    );
                  })}
                </ul>
              </AccordionContent>
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default FilterForm;
