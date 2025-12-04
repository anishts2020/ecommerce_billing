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
import Stiching from "./Pages/Stiching";
import SalesInvoiceStitchingList from "./Pages/SalesInvoiceStichingList"

/* COUPON USER */
import CouponUserView from "./Pages/CouponUserView";


/* PRODUCTS */
import Materials from "./Pages/Materials";
import ProductCategories from "./Pages/ProductCategories";
import Vendors from "./Pages/Vendors";
import ProductSizePage from "./Pages/ProductSizePage";
import Colors from "./Pages/Colors";
import AddProduct from "./Pages/AddProduct";
import ViewProducts from "./Pages/ViewProducts";
import ProductTypes from "./Pages/ProductTypes";

/* USERS & ROLES */
import Roles from "./Pages/Roles";
import UserRoles from "./Pages/UserRoles";
import CreateUser from "./Pages/CreateUser";

/* PURCHASE */
import PurchaseInvoice from "./Pages/PurchaseInvoice";
import PurchaseinvoiceList from "./Pages/PurchaseInvoiceList";
import PurchaseInvoiceItems from "./Pages/PurchaseInvoiceItems";

/* PURCHASE AND SALES REPORT */

import SalesReport from "./Pages/SalesReport"

/* INVENTORY */
import InventoryTransactions from "./Pages/InventoryTransaction";
import SalesChart from "./Pages/SalesChart";
import MonthlyCategoryPieChart from "./Pages/MonthlyCategoryPieChart";
import ProfitLineChart from "./Pages/ProfitLineChart";
import PurchaseChart from "./Pages/PurchaseChart";
import CouponMaster from "./Pages/CouponMaster";

import PurchaseReport from "./Pages/PurchaseReport";


/* Coupons & Discounts */
import CouponProducts from "./Pages/CouponProducts";

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
          <Route path="/stiching" element={<Stiching />} />
           <Route path="/sales-invoice/:invoice_id/stitching-items" element={<SalesInvoiceStitchingList />} />


          <Route path="/coupon-user" element={<CouponUserView />} />


          {/* PRODUCT MANAGEMENT */}
          <Route path="/product-categories" element={<ProductCategories />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/product-sizes" element={<ProductSizePage />} />
          <Route path="/colors" element={<Colors />} />
          <Route path="/product-types" element={<ProductTypes />} />

          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/view-products" element={<ViewProducts />} />

          {/* USERS & ROLES */}
          <Route path="/createroles" element={<Roles />} />
          <Route path="/createuserroles" element={<UserRoles />} />
          <Route path="/createuser" element={<CreateUser />} />
          <Route path="/saleschart" element={<SalesChart/>} />
          <Route path="/productcategorychart" element={<MonthlyCategoryPieChart/>} />
          <Route path="/productprofitbymonth" element={<ProfitLineChart/>} />
          <Route path="/purchaseChart" element={<PurchaseChart/>} />
          {/* PURCHASE */}
          <Route path="/purchase-invoice" element={<PurchaseInvoice />} />
          <Route path="/purchase_list" element={<PurchaseinvoiceList />} />
          <Route path="/purchase-invoice-items/:id" element={<PurchaseInvoiceItems />} />

           {/* Purchase & Roles Report */}
           <Route path="/salesreport" element={<SalesReport />} />
          

          {/* INVENTORY */}
          <Route path="/inventory-transactions" element={<InventoryTransactions />} />
          {/* Coupons and Discount */}
          <Route path="/coupon-master" element={<CouponMaster />} />

             {/* REPORT */}
          <Route path="/purchasereport" element={<PurchaseReport />} />
          

          {/* Coupens & Discounts */}
          <Route path="/coupon-products" element={<CouponProducts />} />

        </Route>

        {/* DEFAULT */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
