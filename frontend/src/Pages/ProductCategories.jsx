import { useState, useEffect } from "react";
import axios from "axios";

// ---------------------------------------------------------
// SVG ICONS
// ---------------------------------------------------------
const AlertTriangleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 
      2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 
      0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 
      0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none"
    viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 
      2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// ---------------------------------------------------------
// CUSTOM ALERT COMPONENT
// ---------------------------------------------------------
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;

  let icon, borderColor, buttonColor, confirmText;

  switch (type) {
    case "confirm":
      icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
      borderColor = "border-yellow-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Yes";
      break;

    case "success":
      icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
      borderColor = "border-green-500";
      buttonColor = "bg-green-600 hover:bg-green-700";
      confirmText = "OK";
      break;

    case "error":
      icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
      borderColor = "border-red-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Close";
      break;

    default:
      icon = <AlertTriangleIcon className="w-10 h-10 text-gray-500" />;
      borderColor = "border-gray-500";
      buttonColor = "bg-blue-600 hover:bg-blue-700";
      confirmText = "OK";
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white p-6 rounded-xl w-96 border-t-8 shadow-xl ${borderColor}`}
      >
        <div className="flex flex-col items-center space-y-4">
          {icon}
          <h1 className="text-xl font-bold text-center">{title}</h1>
          <p className="text-gray-600 text-center">{message}</p>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          {type === "confirm" && (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          )}

          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg shadow ${buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// PRODUCT CATEGORIES MAIN COMPONENT
// ---------------------------------------------------------
export default function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const [product_category_name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // GLOBAL ALERT
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    actionToRun: null,
  });

  const closeAlert = () =>
    setAlertState({
      isOpen: false,
      title: "",
      message: "",
      type: "success",
      actionToRun: null,
    });

  const handleAlertConfirm = () => {
    if (alertState.type === "confirm" && alertState.actionToRun) {
      alertState.actionToRun();
    }
    closeAlert();
  };

  // ---------------------------------------------------------
  const fetchCategories = () => {
    axios
      .get("http://localhost:8000/api/product-categories")
      .then((res) => setCategories(res.data))
      .catch(() =>
        setAlertState({
          isOpen: true,
          title: "Error",
          message: "Failed to load categories",
          type: "error",
        })
      );
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ---------------------------------------------------------
  const handleSave = () => {
    const data = { product_category_name, description };

    if (selectedId) {
      axios
        .put(`http://localhost:8000/api/product-categories/${selectedId}`, data)
        .then(() => {
          fetchCategories();
          setOpenModal(false);
          setName("");
          setDescription("");
          setSelectedId(null);

          setAlertState({
            isOpen: true,
            title: "Updated!",
            message: "Category updated successfully",
            type: "success",
          });
        })
        .catch(() =>
          setAlertState({
            isOpen: true,
            title: "Error",
            message: "Update failed",
            type: "error",
          })
        );
    } else {
      axios
        .post("http://localhost:8000/api/product-categories", data)
        .then(() => {
          fetchCategories();
          setOpenModal(false);
          setName("");
          setDescription("");

          setAlertState({
            isOpen: true,
            title: "Success",
            message: "Category added successfully",
            type: "success",
          });
        })
        .catch((err) => {
          let msg = "Could not add category";

          if (err.response?.status === 422) {
            msg =
              err.response.data.errors?.product_category_name?.[0] ||
              "Validation error";
          }

          setAlertState({
            isOpen: true,
            title: "Error",
            message: msg,
            type: "error",
          });
        });
    }
  };

  // ---------------------------------------------------------
  const handleDelete = (id) => {
    setAlertState({
      isOpen: true,
      title: "Are you sure?",
      message: "This category will be deleted permanently!",
      type: "confirm",
      actionToRun: async () => {
        try {
          await axios.delete(
            `http://localhost:8000/api/product-categories/${id}`
          );
          fetchCategories();

          setAlertState({
            isOpen: true,
            title: "Deleted",
            message: "Category deleted successfully",
            type: "success",
          });
        } catch {
          setAlertState({
            isOpen: true,
            title: "Error",
            message: "Delete failed",
            type: "error",
          });
        }
      },
    });
  };

  // ---------------------------------------------------------
  return (
    <div className="p-5">
      {/* Add Category Button */}
      <div className="w-full flex justify-center mb-6">
        <button
          onClick={() => {
            setSelectedId(null);
            setName("");
            setDescription("");
            setOpenModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow"
        >
          + Add Category
        </button>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">
              {selectedId ? "Edit Category" : "Add Category"}
            </h2>

            <input
              type="text"
              placeholder="Category name"
              value={product_category_name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 w-full mb-4 rounded-xl"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-3 w-full rounded-xl h-24"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setOpenModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>

              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Table */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Category List
        </h3>

        <table className="w-full border-collapse shadow rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <tr key={cat.product_category_id} className="hover:bg-gray-100">
                  <td className="p-3 border">
                    {cat.product_category_id}
                  </td>
                  <td className="p-3 border">
                    {cat.product_category_name}
                  </td>
                  <td className="p-3 border">{cat.description}</td>
                  <td className="p-3 border text-center">
                    <button
                      onClick={() => {
                        setSelectedId(cat.product_category_id);
                        setName(cat.product_category_name);
                        setDescription(cat.description);
                        setOpenModal(true);
                      }}
                      className="bg-blue-600 text-white px-4 py-1.5 mr-2 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(cat.product_category_id)
                      }
                      className="bg-red-500 text-white px-4 py-1.5 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-3 border text-center" colSpan="4">
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* GLOBAL ALERT */}
      <CustomAlert
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        onConfirm={handleAlertConfirm}
        onClose={closeAlert}
      />
    </div>
  );
}