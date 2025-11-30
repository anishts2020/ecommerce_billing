import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.username}</h2>
    <div className="space-y-6">
    <div className="grid grid-cols-3 gap-4">
      <div
        className="p-4 bg-blue-200 rounded shadow cursor-pointer hover:shadow-lg"
        onClick={() => navigate("/vendors")}
      >
        <h3 className="font-semibold text-lg">Vendors</h3>
        <p className="text-sm text-gray-600">Manage vendor details</p>
      </div>

      <div
        className="p-4 bg-blue-200 rounded shadow cursor-pointer hover:shadow-lg"
        onClick={() => navigate("/sales-invoice")}
      >
        <h3 className="font-semibold text-lg">Sales</h3>
        <p className="text-sm text-gray-600">Manage sales details</p>
      </div>

      <div
        className="p-4 bg-blue-200 rounded shadow cursor-pointer hover:shadow-lg"
        onClick={() => navigate("/purchase-invoice-items")}
      >
        <h3 className="font-semibold text-lg">Purchase</h3>
        <p className="text-sm text-gray-600">Manage purchase details</p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div
        className="p-4 bg-blue-200 rounded shadow cursor-pointer hover:shadow-lg"
        onClick={() => navigate("/view-products")}
      >
        <h3 className="font-semibold text-lg">Products</h3>
        <p className="text-sm text-gray-600">Manage product details</p>
      </div>

      <div
        className="p-4 bg-blue-200 rounded shadow cursor-pointer hover:shadow-lg"
        onClick={() => navigate("/product-categories")}
      >
        <h3 className="font-semibold text-lg">Product Category</h3>
        <p className="text-sm text-gray-600">Manage product category</p>
      </div>

      <div
        className="p-4 bg-blue-200 rounded shadow cursor-pointer hover:shadow-lg"
        onClick={() => navigate("/materials")}
      >
        <h3 className="font-semibold text-lg">Materials</h3>
        <p className="text-sm text-gray-600">Manage material details</p>
      </div>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <div
        className="p-4 bg-blue-200 rounded shadow cursor-pointer hover:shadow-lg"
        onClick={() => navigate("/customers")}
      >
        <h3 className="font-semibold text-lg">Customers</h3>
        <p className="text-sm text-gray-600">Manage customer details</p>
      </div>

      <div
        className="p-4 bg-blue-200 rounded shadow cursor-pointer hover:shadow-lg"
        onClick={() => navigate("/employees")}
      >
        <h3 className="font-semibold text-lg">Employees</h3>
        <p className="text-sm text-gray-600">Manage product category</p>
      </div>

      <div
        className="p-4 bg-blue-200 rounded shadow cursor-pointer hover:shadow-lg"
        onClick={() => navigate("/createuser")}
      >
        <h3 className="font-semibold text-lg">Users</h3>
        <p className="text-sm text-gray-600">Manage material details</p>
      </div>
    </div>

    </div>
      
    </div>
  );
}