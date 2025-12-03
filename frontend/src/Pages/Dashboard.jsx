
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopSellingModal from "../Modal/TopSellingModal";

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
  const [showTopSellingModal, setShowTopSellingModal] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

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


          {/* Top Selling Product Card */}
          <div className={cardClass} onClick={() => setShowTopSellingModal(true)}>
            <ChartBarIcon className={iconClass} />
            <div>
              <h3 className="font-semibold text-lg">Top Selling Product</h3>
              <p className="text-sm text-gray-600">View products with highest sales</p>
            </div>
          </div>

          {/* Modal */}
          {showTopSellingModal && (
            <TopSellingModal onClose={() => setShowTopSellingModal(false)} />
          )}




        </div>

      </div>
    </div>



  );
}