import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ProductCategories from "./Pages/ProductCategories";

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
          <Route
         path="/ProductCategories"
         element={
            <PrivateRoute>
                <ProductCategories />
            </PrivateRoute>
            }
/>

        {/* default route */}
        <Route path="*" element={<Login />} />
        <Route path="ProductCategories" element={<ProductCategories />} />
      </Routes>
    </Router>
  );
}

export default App;