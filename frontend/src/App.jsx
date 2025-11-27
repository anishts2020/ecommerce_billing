import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import EmployeeDetails from "./Pages/EmployeeDetails";
import SalaryDetails from './Pages/SalaryDetails';
import Customer from './Pages/Customer';
import CustomerDetailsForm from './Pages/CustomerDetailsForm';
import SalesInvoice from './Pages/SalesInvoice';
import SalesinvoiceList from './Pages/SalesinvoiceList';
import SalesInvoiceItems from './Pages/SalesInvoiceItems';

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
        <Route path="/employees" element={
            <PrivateRoute>
              <EmployeeDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/salary/:id"
          element={
            <PrivateRoute>
              <SalaryDetails />
            </PrivateRoute>
          }
        />
        <Route path="/customers" element={
          <PrivateRoute>
            <Customer/>
          </PrivateRoute>
        }
        />

        {/* default route */}
        <Route path="*" element={<Login />} />
        <Route path="/customer-form" element={<CustomerDetailsForm />} />
        <Route path="/sales-invoice" element={<SalesInvoice/>} />
        <Route path='/sales-voiceList' element={<SalesinvoiceList/>}/>
        <Route path="/sales-invoice-items/:id" element={<SalesInvoiceItems/>} />

      </Routes>
    </Router>
  );
}

export default App;