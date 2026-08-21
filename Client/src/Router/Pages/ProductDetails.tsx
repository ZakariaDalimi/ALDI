import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useParams } from "react-router-dom";
import { singleProductQuery } from "../../api/singleProductQuery";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../Components/ui/accordion";

const ProductDetails = () => {
  const { id } = useParams();
  if (id !== undefined) {
    const { data: product } = useQuery(singleProductQuery(id));
    if (product !== undefined) {
      const {
        brand,
        imageUrl,
        isDiscount,
        name: title,
        offerCategory,
        offerSectionTitle,
        price,
        salesUnit,
        slug,
        validityEnd,
        validityStart,
      } = product;

      return (
        <section className="px-page-desktop">
          {product && (
            <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg mt-25">
              <div className="w-full h-full  ">
                <img
                  className="h-auto max-h-[500px]"
                  src={product?.imageUrl}
                  alt=""
                />
              </div>
              <header className="pt-25 sticky top-0">
                <h1 className="text-4xl font-bold">
                  {title} {salesUnit}
                </h1>
              </header>
              <div className="">
              
               

                <Accordion
                  type="single"
                  collapsible
                  defaultValue="shipping"
                  className="max-w-lg"
                >
                  <AccordionItem value="shipping">
                    <AccordionTrigger>
                        <h4 className="text-2xl text-black font-bold">
                  Produktdetails
                </h4>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-4">
                  <li className="">Brand: {brand}</li>
                  <li>je {salesUnit}</li>
                </ul>
                    </AccordionContent>
                  </AccordionItem>
             
                  
                </Accordion>
              </div>
            </div>
            
            <div>
                

            </div>
            </>

          )}
        </section>
      );
    }
  }
};

export default ProductDetails;
