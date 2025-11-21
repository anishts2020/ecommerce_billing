import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import EmployeeDetails from "./Pages/EmployeeDetails";
import SalaryDetails from './Pages/SalaryDetails';

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

        {/* default route */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;