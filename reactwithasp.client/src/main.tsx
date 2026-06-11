import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './System.css'
import App from './App.tsx'
import Navbar from './Components/Navbar';
import Router from './Router/Router';
const navItems = [
    { title: "Categories", linkTo: "/categories" },
    { title: "Products", linkTo: "/products" },
    { title: "Test", linkTo: "/test" },
  ];
createRoot(document.getElementById('root')).render(
 <StrictMode>

    <Router>
            <Navbar navLinks={navItems} />

    </Router>
  </StrictMode>,
)
