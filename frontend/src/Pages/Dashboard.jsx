import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import Icons
import {
  BuildingStorefrontIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  CubeIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  UsersIcon,
  UserGroupIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  // Fetch revenue on page load
useEffect(() => {
  fetchRevenue();
}, []);

const fetchRevenue = () => {
  fetch("http://localhost:8000/api/total-revenue-today")
    .then((res) => res.json())
    .then((data) => {
      setTotalRevenue(data.totalRevenueToday);
      setRevenueData(data.productWiseRevenue);
    })
    .catch((err) => console.error(err));
};

    // Fetch revenue when modal opens
  // useEffect(() => {
  //   if (!showRevenueModal) return;

  //   fetch("http://localhost:8000/api/total-revenue-today")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setTotalRevenue(data.totalRevenueToday);
  //       setRevenueData(data.productWiseRevenue);
  //     })
  //     .catch((err) => console.error(err));
  // }, [showRevenueModal]);

  if (!user) return <div>Loading...</div>;

  const cardClass =
    "p-4 h-32 bg-blue-200 rounded-lg shadow cursor-pointer hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 flex items-center gap-4";

  const iconClass = "h-10 w-10 text-blue-700";


  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Welcome, {user.username}</h2>

      <div className="space-y-6">

        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-4">

          {/* Vendors */}
          <div className={cardClass} onClick={() => navigate("/vendors")}>
            <BuildingStorefrontIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Vendors</h3>
              <p className="text-sm text-gray-600">Manage vendor details</p>
            </div>
          </div>

          {/* Sales */}
          <div className={cardClass} onClick={() => navigate("/sales-invoice")}>
            <ChartBarIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Sales</h3>
              <p className="text-sm text-gray-600">Manage sales details</p>
            </div>
          </div>

          {/* Purchase */}
          <div
            className={cardClass}
            onClick={() => navigate("/purchase-invoice-items")}
          >
            <ShoppingCartIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Purchase</h3>
              <p className="text-sm text-gray-600">Manage purchase details</p>
            </div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-4">

          {/* Products */}
          <div className={cardClass} onClick={() => navigate("/view-products")}>
            <CubeIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Products</h3>
              <p className="text-sm text-gray-600">Manage product details</p>
            </div>
          </div>

          {/* Product Category */}
          <div
            className={cardClass}
            onClick={() => navigate("/product-categories")}
          >
            <Squares2X2Icon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Product Category</h3>
              <p className="text-sm text-gray-600">Manage product category</p>
            </div>
          </div>

          {/* Materials */}
          <div className={cardClass} onClick={() => navigate("/materials")}>
            <ClipboardDocumentListIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Materials</h3>
              <p className="text-sm text-gray-600">Manage material details</p>
            </div>
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-3 gap-4">

          {/* Customers */}
          <div className={cardClass} onClick={() => navigate("/customers")}>
            <UsersIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Customers</h3>
              <p className="text-sm text-gray-600">Manage customer details</p>
            </div>
          </div>

          {/* Employees */}
          <div className={cardClass} onClick={() => navigate("/employees")}>
            <UserGroupIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Employees</h3>
              <p className="text-sm text-gray-600">Manage employees</p>
            </div>
          </div>

          {/* Users */}
          <div className={cardClass} onClick={() => navigate("/createuser")}>
            <UserCircleIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Users</h3>
              <p className="text-sm text-gray-600">Manage user accounts</p>
            </div>
          </div>

         {/* Total revenue Today*/}
         <div className={cardClass} onClick={() => setShowRevenueModal(true)}>
  <UserCircleIcon className={iconClass} />
  <div>
    <h3 className="font-semibold text-lg">Total Revenue Today</h3>
      <p className="text-sm text-gray-600">₹ {totalRevenue.toFixed(2)}</p>
  </div>
</div>

{showRevenueModal && (
 <div className="fixed inset-0  backdrop-blur-md flex items-center justify-center z-50">

    <div className="bg-white p-8 rounded-xl shadow-xl w-[700px] max-h-[85vh] overflow-y-auto">

      <h2 className="text-3xl font-bold mb-6 text-blue-600 text-center">
        Total Revenue Today: ₹ {totalRevenue.toFixed(2)}
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-600 text-white text-center text-lg">
            <th className="p-3 border">SL No</th>
            <th className="p-3 border">Product Name</th>
            <th className="p-3 border">Revenue (₹)</th>
          </tr>
        </thead>

        <tbody>
          {revenueData.map((item, index) => (
            <tr key={index} className="text-center text-base">
              <td className="border p-3">{index + 1}</td>
              <td className="border p-3">{item.product_name}</td>
              <td className="border p-3 text-green-700 font-semibold">
                ₹ {item.revenue.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>

        
      </table>

      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600"
          onClick={() => setShowRevenueModal(false)}
        >
          Close
        </button>
      </div>

    </div>
  </div>
)}



        </div>
        

      </div>
    </div>



  );
}
