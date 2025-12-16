import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import OccasionalProductsPage from "./pages/OccasionalProductsPage.jsx";
import NewArrivalPage from "./pages/NewArrivalPage";
import TopSellersPage from "./pages/TopSellersPage";
import FeaturedProductsPage from "./pages/FeaturedProductsPage";
import ProductsPage from "./pages/ProductsPage.jsx";

import Home from "./pages/Home";
import ProductModal from "./pages/ProductModal";
import ProductSearch from "./components/ProductSearch";
import Cart from "./pages/Cart";
import OrderSummary from "./pages/OrderSummary";
import PaymentPage from "./pages/PaymentPage";
import FinalOrderSummary from "./pages/FinalOrderSummary"; // you will create this

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Products Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/new-arrivals" element={<NewArrivalPage />} />
        <Route path="/top-sellers" element={<TopSellersPage />} />
        <Route path="/occasional-products" element={<OccasionalProductsPage />} />
        <Route path="/featured-products" element={<FeaturedProductsPage />} />
        <Route path="/products" element={<ProductsPage/>} />
        {/* Add more routes here */}
        {/* <Route path="/products" element={<Products />} /> */}
        <Route path="/product/:productCode" element={<ProductModal />} />
        <Route path="/search" element={<ProductSearch />} />
        {/* Cart */}
        <Route path="/cart" element={<Cart />} />

        {/* Order Summary (address, gst, payment mode selection) */}
        <Route path="/order-summary" element={<OrderSummary />} />

        {/* Payment Page */}
        <Route path="/payment" element={<PaymentPage />} />

        {/* Final Page After Successful Order */}
        <Route path="/order-summary-final" element={<FinalOrderSummary />} />

      </Routes>
    </BrowserRouter>

    
  );
}

export default App;
