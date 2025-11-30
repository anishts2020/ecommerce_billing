import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/Layout";

/* AUTH */
import Login from "./Pages/Login";

/* DASHBOARD */
import Dashboard from "./Pages/Dashboard";

/* EMPLOYEES */
import Employee from "./Pages/Employee";
import SalaryDetails from "./Pages/SalaryDetails";

/* CUSTOMERS */
import Customer from "./Pages/Customer";
import CustomerDetailsForm from "./Pages/CustomerDetailsForm";

/* SALES */
import Salesinvoice from "./Pages/Salesinvoice";
import SalesinvoiceList from "./Pages/SalesinvoiceList";
import SalesInvoiceItems from "./Pages/SalesInvoiceItems";

/* PRODUCTS */
import Materials from "./Pages/Materials";
import ProductCategories from "./Pages/ProductCategories";
import Vendors from "./Pages/Vendors";
import ProductSizePage from "./Pages/ProductSizePage";
import Colors from "./Pages/Colors";
import AddProduct from "./Pages/AddProduct";
import ViewProducts from "./Pages/ViewProducts";

/* USERS & ROLES */
import Roles from "./Pages/Roles";
import UserRoles from "./Pages/UserRoles";
import CreateUser from "./Pages/CreateUser";

/* PURCHASE */
import PurchaseInvoiceItems from "./Pages/PurchaseInvoiceItem";

/* INVENTORY */
import InventoryTransactions from "./Pages/InventoryTransaction";


export default function App() {
  return (
    <Router>
      <Routes>

        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED LAYOUT ROUTES */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >

          {/* DASHBOARD */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* EMPLOYEES */}
          <Route path="/employees" element={<Employee />} />
          <Route path="/salary/:id" element={<SalaryDetails />} />

          {/* CUSTOMERS */}
          <Route path="/customers" element={<Customer />} />
          <Route path="/customer-form" element={<CustomerDetailsForm />} />

          {/* SALES */}
          <Route path="/sales-invoice" element={<Salesinvoice />} />
          <Route path="/salesinvoice_list" element={<SalesinvoiceList />} />
          <Route path="/sales-invoice-items/:id" element={<SalesInvoiceItems />} />

          {/* PRODUCT MANAGEMENT */}
          <Route path="/product-categories" element={<ProductCategories />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/product-sizes" element={<ProductSizePage />} />
          <Route path="/colors" element={<Colors />} />

          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/view-products" element={<ViewProducts />} />

          {/* USERS & ROLES */}
          <Route path="/createroles" element={<Roles />} />
          <Route path="/createuserroles" element={<UserRoles />} />
          <Route path="/createuser" element={<CreateUser />} />

          {/* PURCHASE */}
          <Route path="/purchase-invoice-items" element={<PurchaseInvoiceItems />} />

          {/* INVENTORY */}
          <Route path="/inventory-transactions" element={<InventoryTransactions />} />

        </Route>

        {/* DEFAULT */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}