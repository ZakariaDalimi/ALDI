import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Root from "./Pages/Root";
import Categories from "./Pages/Categories";
import Sales from "./Pages/Sales";
import NotFound from "./Pages/NotFound";
import Navbar from "../Components/Navbar";

const navItems = [
  { title: "Categories", linkTo: "/categories" },
  { title: "Sales", linkTo: "/sales" }, // Assuming this routes somewhere or to Root
  { title: "Test", linkTo: "/test" },
];







const Layout = () => {
  return (
    <>
      <Navbar navLinks={navItems} />
      <main className="px-page-desktop">
        <Outlet /> 
      </main>
    </>
  );
};

// ==========================================
// 3. ROUTER CONFIGURATION (Defined Outside)
// ==========================================
const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout, // The layout wraps all the pages below
    children: [
      {
        index: true, // index: true means this is the default page at "/"
        Component: Root,
      },
      {
        path: "categories",
        Component: Categories,
      },
      {
        path: "sales",
        Component: Sales,
      },
      {
        path: "*", // Catch-all route for any undefined URLs
        Component: NotFound,
      },
    ],
  },
]);

// ==========================================
// 4. THE ROUTER COMPONENT
// ==========================================
const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;