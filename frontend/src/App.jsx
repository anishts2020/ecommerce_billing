import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

import Materials from "./Pages/Materials";
import ProductCategories from "./Pages/ProductCategories";
import Vendors from "./Pages/Vendors";
import ProductSizePage from "./Pages/ProductSizePage";
import Colors from "./Pages/Colors";
import Roles from "./Pages/Roles";
import UserRoles from "./Pages/UserRoles";

// Product pages
import AddProduct from "./pages/AddProduct";
import ViewProducts from "./pages/ViewProducts";

// MISSING IMPORT FIXED
import CreateUser from "./Pages/CreateUser";
import InventoryTransactions from "./Pages/InventoryTransaction"

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Admin Screens (unprotected routes FIRST) */}
        <Route path="/createroles" element={<Roles />} />
        <Route path="/createuserroles" element={<UserRoles />} />
        <Route path="/CreateUser" element={<CreateUser />} />

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
          path="/ProductCategories"
          element={
            <PrivateRoute>
              <ProductCategories />
            </PrivateRoute>
          }
        />

        <Route
          path="/Materials"
          element={
            <PrivateRoute>
              <Materials />
            </PrivateRoute>
          }
        />

        <Route
          path="/vendors"
          element={
            <PrivateRoute>
              <Vendors />
            </PrivateRoute>
          }
        />

        <Route
          path="/product-sizes"
          element={
            <PrivateRoute>
              <ProductSizePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/color-form"
          element={
            <PrivateRoute>
              <Colors />
            </PrivateRoute>
          }
        />

        {/* products */}
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
        <Route
          path="/colors"
          element={
            <PrivateRoute>
              <Colors />
            </PrivateRoute>
          }
        />
 <Route
          path="/CreateUser"
          element={
            <PrivateRoute>
              <CreateUser />
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

        <Route path="/inventory-transactions" element={<InventoryTransactions />} />

        {/* Default */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;