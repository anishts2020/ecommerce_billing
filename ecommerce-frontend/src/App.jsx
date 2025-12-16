import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OccasionalProductsPage from "./pages/OccasionalProductsPage.jsx";
import NewArrivalPage from "./pages/NewArrivalPage";
import TopSellersPage from "./pages/TopSellersPage";
import FeaturedProductsPage from "./pages/FeaturedProductsPage";
import ProductsPage from "./pages/ProductsPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Products Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/new-arrivals" element={<NewArrivalPage />} />
        <Route path="/top-sellers" element={<TopSellersPage />} />
        <Route path="/occasional-products" element={<OccasionalProductsPage />} />
        <Route path="/featured-products" element={<FeaturedProductsPage />} />
        <Route path="/products" element={<ProductsPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
