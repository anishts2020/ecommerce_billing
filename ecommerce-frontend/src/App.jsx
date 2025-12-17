import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Order from "./pages/Order";
import Payment from "./pages/Payment";
import Cart from "./pages/Cart";
import OrderSummary from "./pages/OrderSummary";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Order Page */}
        <Route path="/order" element={<Order />} />
         <Route path="/cart" element={<Cart />} />

        {/* Add more routes here */}
        <Route path="/payment" element={<Payment />} />
<Route path="/order-summary" element={<OrderSummary/>}/>
        {/* <Route path="/products" element={<Products />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

