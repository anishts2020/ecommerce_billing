import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Employee from './Pages/Employee';
import Customer from './Pages/Customer';

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
        {/* Employee Page Route */}
        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <Employee />
            </PrivateRoute>
          }
        />
         {/* customer */}
         <Route
          path="/customers"
          element={
            <PrivateRoute>
              <Customer />
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