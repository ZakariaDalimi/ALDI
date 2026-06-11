import React from "react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { categoriesQuery } from "../api/categoriesQuery";

interface Props {
  navLinks: [{ title: string; linkTo: string }];
}
const Navbar: React.FC<Props> = ({ navLinks }) => {

    const {data:categories, isLoading } = useQuery(categoriesQuery);
  const preview = categories?.slice(0,4) || [];

    console.log('====================================');
    console.log(preview);
    console.log('====================================');
  return (
    <header className="py-stack-sm bg-tertiary-container px-page-desktop flex gap-gutter-desktop items-center">
      <Link to="/">
      <Logo />
      </Link>
      <nav className="flex-1 flex pl-stack-md">
        {navLinks.length > 0 && 
        <ul className="flex gap-x-gutter-desktop ">
            {  navLinks.map((item) => {
          return (
              <li className="text-headline-sm text-inverse-on-surface" key={item.title}>
                    <NavLink  className={({isActive, isPending})=>{
                       return isActive ? "nav-link nav-active"
                        : "nav-link"
                    
                    }} to={item.linkTo}>{item.title}</NavLink>
              </li>
          );
        })}
        </ul>
        }
            </nav>

    </header>
  );
};

export default Navbar;
