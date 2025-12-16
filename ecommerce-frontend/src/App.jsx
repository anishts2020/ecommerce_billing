import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import OccasionalProductsPage from "./pages/OccasionalProductsPage.jsx";
import NewArrivalPage from "./pages/NewArrivalPage";
import TopSellersPage from "./pages/TopSellersPage";
import FeaturedProductsPage from "./pages/FeaturedProductsPage";
import ProductsPage from "./pages/ProductsPage.jsx";

import ProductModal from "./pages/ProductModal";
import ProductSearch from "./components/ProductSearch";
import Cart from "./pages/Cart";
import OrderSummary from "./pages/OrderSummary";
import PaymentPage from "./pages/PaymentPage";
import FinalOrderSummary from "./pages/FinalOrderSummary";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Product Listing Pages */}
        <Route path="/new-arrivals" element={<NewArrivalPage />} />
        <Route path="/top-sellers" element={<TopSellersPage />} />
        <Route path="/occasional-products" element={<OccasionalProductsPage />} />
        <Route path="/featured-products" element={<FeaturedProductsPage />} />
        <Route path="/products" element={<ProductsPage />} />

        {/* Product Details */}
        <Route path="/product/:productCode" element={<ProductModal />} />

        {/* Search */}
        <Route path="/search" element={<ProductSearch />} />

        {/* Cart */}
        <Route path="/cart" element={<Cart />} />

        {/* Order Flow */}
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-summary-final" element={<FinalOrderSummary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;