import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Materials from './Pages/Materials';
import Login from "./pages/Login";
import Dashboard from "./Pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import Vendors from './Pages/Vendors';
import ProductSizePage from './Pages/ProductSizePage';
import Colors from './Pages/Colors';
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
           <Route path="/Materials" element={<Materials />} />
        <Route path='/vendors' element={<Vendors/>}></Route>
        <Route path="/product-sizes" element={<ProductSizePage />} />
        <Route path="/color-form" element={<Colors/>}></Route>
                <Route path="/CreateUser" element={<CreateUser/>} />

      </Routes>
    </Router>
  );
}

export default App;
