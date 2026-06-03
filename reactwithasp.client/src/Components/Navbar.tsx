import React from "react";
import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
interface Props {
  navLinks: [{ title: string; linkTo: string }];
}
const Navbar: React.FC<Props> = ({ navLinks }) => {

  return (
    <header className="py-stack-md bg-tertiary-container px-page-desktop flex gap-gutter-desktop items-center">
      <Link to="/">
      <Logo />
      </Link>
      <nav className="flex-1 flex pl-page-desktop">
      {navLinks.length > 0 &&
        navLinks.map((item) => {
          return (
            
              <ul className="" key={item.title}>
                <li className="text-headline-md text-white">
                    <NavLink to={item.linkTo}>{item.title}</NavLink>
                </li>
              </ul>
          );
        })}
            </nav>

    </header>
  );
};

export default Navbar;
