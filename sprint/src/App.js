import "./styles/App.css";
import { ShoppingCartProvider } from "./context/ShoppingCartContext.js";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import Checkout from "./components/Checkout.jsx";
import ProductDetails from "./components/ProductDetails.jsx";

function App() {
  return (
    <>
      <ShoppingCartProvider>
        <Router>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            {/* Fallback or Default Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ShoppingCartProvider>
    </>
  );
}

export default App;
