import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";


// Product pages
import AddProduct from "./pages/AddProduct";
import ViewProducts from "./pages/ViewProducts";


function App() {
  return (
    <Router>
      <Routes>

        {/* Public Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        

        <Route
          path="/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />

        <Route
          path="/view-products"
          element={
            <PrivateRoute>
              <ViewProducts />
            </PrivateRoute>
          }
        />
       


       

        {/* Default route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
