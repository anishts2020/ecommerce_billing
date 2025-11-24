import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./Pages/Dashboard";
import Roles from "./Pages/Roles";
import UserRoles from "./Pages/UserRoles";
import PrivateRoute from "./components/PrivateRoute";
import "./App.css";

function App() {
  

  return (
    <Router>
      <Routes>

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        <Route path="/createroles" element={<Roles />} />
        <Route path="/createuserroles" element={<UserRoles />} />
        {/* Protected Route */}
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

        {/* Default route → Redirect to login */}
        <Route path="*" element={<Login />} />
                <Route path="/CreateUser" element={<CreateUser/>} />

      </Routes>
    </Router>
  );
}

export default App;
