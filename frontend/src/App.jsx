import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Vendors from './Pages/Vendors';
import ProductSizePage from './Pages/ProductSizePage';
import Colors from './Pages/Colors';

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* default route */}
        <Route path="*" element={<Login />} />
        <Route path='/vendors' element={<Vendors/>}></Route>
        <Route path="/product-sizes" element={<ProductSizePage />} />
        <Route path="/color-form" element={<Colors/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;