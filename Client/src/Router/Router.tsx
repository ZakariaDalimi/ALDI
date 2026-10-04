import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import Root from "./Pages/Root";
import Categories from "./Pages/Categories";
import NotFound from "./Pages/NotFound";
import Navbar from "../Components/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SingleCategoryPage from "./Pages/SingleCategoryPage";
import { categoriesQuery } from "../api/categoriesQuery";
import Offers from "./Pages/Offers";
import ProductDetails from "./Pages/ProductDetails";
import Products from "./Pages/Products";
import ShoppingLists from "./Pages/ShoppingLists";
import { productsQuery } from "../api/discountedProducts";
import GlobalLoadingOverlay from "../Components/GlobalLoadingOverlay";
import { ProductListsProvider } from "../Components/ProductListsContext";
import Footer from "../Components/Footer";
import { Toaster } from "sonner";
export const queryClient = new QueryClient();
const navItems = [
  { title: "Wochenangebote", linkTo: "/offers" }, // Assuming this routes somewhere or to Root
  { title: "Produkte", linkTo: "/products" },
  { title: "Categories", linkTo: "/categories" },
];

const AppContent = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar navLinks={navItems} />
      <Toaster
        position="top-right"
        richColors
        closeButton
        className="aldi-toaster"
      />
      <GlobalLoadingOverlay />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const Layout = () => (
  <QueryClientProvider client={queryClient}>
    <ProductListsProvider>
      <AppContent />
    </ProductListsProvider>
  </QueryClientProvider>
);

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
        path: "products",
        Component: Products,
      },
      {
        path: "einkaufsliste",
        Component: ShoppingLists,
      },
      {
        path: "categories",
        children: [
          {
            Component: Categories,
            index: true,
            loader: async () => {
              await queryClient.ensureQueryData(categoriesQuery);
              return null;
            },
          },
          {
            path: ":categoryName",
            Component: SingleCategoryPage,
          },
        ],
      },
      {
        path: "offers",
        children: [
          {
            Component: Offers,
            index: true,
            loader: async () => {
              await queryClient.ensureQueryData(productsQuery);
              return null;
            },
          },
          {
            path: "/offers/:id",
            Component: ProductDetails,
          },
        ],
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
