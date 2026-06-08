import React from "react";
import aldi1 from "../assets/aldi-hero.png";
import aldi2 from "../assets/aldi-hero2.png";
import cat from "../assets/cat1.png";
import ananas from "../assets/ananas.png"
import green from "../assets/green.png"
import brott from "../assets/brott.png"
import milch from "../assets/milch.png"

import { Link } from "react-router-dom";

const Grid = () => {
  return (
    <section className="px-page-desktop mb-gutter-desktop">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between mb-gutter-desktop w-full gap-4">
        <div className="w-full">
          <h1 className="text-headline-lg text-black ">Browse Categories</h1>
          <h4 className="text-headline-md text-gray-500 font-normal">
            Browse Categories Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit quasi odio tenetur at 
          </h4>
        </div>
        <div className="w-full flex lg:justify-end justify-start">
          <Link
            className="p-4 rounded-md hover:opacity-70 bg-secondary-container text-white transition-ease duration-400 flex items-center gap-2 text-primary font-bold w-fit"
            to="/categories"
          >
            View All
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-right"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
              />
            </svg>
          </Link>
        </div>
      </header>

      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-[2rem] auto-rows-[250px] lg:grid-rows-[170px_220px] 2xl:grid-rows-[400px_400px]">
        
        <div 
          className="rounded-lg lg:row-span-2 lg:col-span-2 bg-no-repeat bg-cover bg-center" 
          style={{ backgroundImage: `url(${ananas})` }}
        />

        <div 
          className="rounded-lg bg-no-repeat bg-cover bg-center" 
          style={{ backgroundImage: `url(${milch})` }}
        />

        <div 
          className="rounded-lg bg-no-repeat bg-cover bg-center" 
          style={{ backgroundImage: `url(${brott})` }}
        />

        <div 
          className="rounded-lg lg:col-span-2 bg-no-repeat bg-cover bg-center" 
          style={{ backgroundImage: `url(${green})` }}
        />
        
      </div>
    </section>
  );
};

export default Grid;