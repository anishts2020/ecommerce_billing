import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Order from "./pages/Order";
import Payment from "./pages/Payment";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Order Page */}
        <Route path="/order" element={<Order />} />

        {/* Add more routes here */}
        <Route path="/payment" element={<Payment />} />

        {/* <Route path="/products" element={<Products />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;