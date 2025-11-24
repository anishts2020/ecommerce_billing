import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import UserList from './Pages/UserList';
import CreateUser from './Pages/CreateUser';



function App() {
  

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard
                openCreateModal={() => setIsModalOpen(true)}
              />
              
            </PrivateRoute>
          }
        />

        {/* Optional: separate page for users list */}
        <Route path="/users" element={<UserList />} />

        {/* default route */}
        <Route path="*" element={<Login />} />
                <Route path="/CreateUser" element={<CreateUser/>} />

      </Routes>
    </Router>
  );
}

export default App;
