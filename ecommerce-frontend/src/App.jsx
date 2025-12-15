import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddressForm from "./pages/AddressForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home Page */}
  
           <Route path="/" element={<Home />} />
 <Route path="/address" element={<AddressForm />} />
        {/* Add more routes here */}
        {/* <Route path="/products" element={<Products />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;