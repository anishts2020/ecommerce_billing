import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductModal from "./pages/ProductModal";
import ProductSearch from "./components/ProductSearch";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Add more routes here */}
        {/* <Route path="/products" element={<Products />} /> */}
        <Route path="/product/:productCode" element={<ProductModal />} />
        <Route path="/search" element={<ProductSearch />} />
      </Routes>
    </BrowserRouter>

    
  );
}

export default App;