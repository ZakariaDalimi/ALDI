import "./System.css"
import Navbar from "./Components/Navbar";
const navItems = [
    { title: "Categories", linkTo: "/categories" },
    { title: "Products", linkTo: "/products" },
    { title: "Test", linkTo: "/test" },
  ];
function App() {
  
    return (
        <>
            <Navbar navLinks={navItems} />
            
        </>
    );
    
    
}

export default App;