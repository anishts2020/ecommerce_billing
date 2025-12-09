import React, { useState, useEffect } from "react";
import AlertModal from "../Modal/AlertModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../Api";

export default function CouponProducts() {
  const [couponProducts, setCouponProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    coupon_id: "",
    product_id: "",
  });

  const [editId, setEditId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Alert Modal State
  const [alertModal, setAlertModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
    confirmAction: null,
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ====================== MODAL HANDLERS ======================
  const openAlert = (type, title, message, confirmAction = null) => {
    setAlertModal({ isOpen: true, type, title, message, confirmAction });
  };

  const closeAlert = () =>
    setAlertModal({
      isOpen: false,
      type: "",
      title: "",
      message: "",
      confirmAction: null,
    });

  // ====================== LOAD DATA ======================
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [couponRes, productRes, cpRes] = await Promise.all([
        api.get("/coupon"),
        api.get("/products"),
        api.get("/coupon-products"),
      ]);

      const couponData = Array.isArray(couponRes.data.data)
        ? couponRes.data.data
        : [];

      setCoupons(couponData);
      setProducts(Array.isArray(productRes.data) ? productRes.data : []);
      setCouponProducts(Array.isArray(cpRes.data) ? cpRes.data : []);
    } catch (err) {
      console.error("Error fetching data:", err);
      openAlert("error", "Data Error", "Failed to load data.");
    }
  };

  // ====================== HANDLE CHANGE ======================
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ====================== OPEN MODALS ======================
  const openAdd = () => {
    setEditId(null);
    setFormData({ coupon_id: "", product_id: "" });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditId(item.id);
    setFormData({
      coupon_id: item.coupon?.coupon_master_id ?? "",
      product_id: item.product?.product_id ?? "",
    });
    setModalOpen(true);
  };

  // ====================== SUBMIT FORM ======================
  const handleSubmit = async () => {
    if (!formData.coupon_id || !formData.product_id) {
      openAlert("error", "Validation Error", "All fields are required.");
      return;
    }

    const duplicate = couponProducts.some(
      (cp) =>
        String(cp.coupon?.coupon_master_id) === String(formData.coupon_id) &&
        String(cp.product?.product_id) === String(formData.product_id) &&
        cp.id !== editId
    );

    if (duplicate) {
      openAlert(
        "error",
        "Duplicate Entry",
        "Coupon is already assigned for this product"
      );
      return;
    }

    try {
      const payload = {
        coupon_id: Number(formData.coupon_id),
        product_id: Number(formData.product_id),
      };

      if (editId) {
        await api.put(
          `/coupon-products/${editId}`,
          payload
        );
        openAlert(
          "success",
          "Updation Successful",
          "Product Coupon updated successfully."
        );
      } else {
        await api.post(
          "/coupon-products",
          payload
        );
        openAlert(
          "success",
          "Saved Successfully",
          "Coupon assigned successfully."
        );
      }

      fetchAll();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      openAlert("error", "API Error", "An error occurred while saving the data.");
    }
  };

  // ====================== DELETE ======================
  const confirmDelete = (id) => {
    openAlert(
      "delete-confirm",
      "Are you sure?",
      "This product coupon will be permanently deleted?",
      () => handleDelete(id)
    );
  };

  const handleDelete = async (id) => {
    closeAlert();
    try {
      await api.delete(
        `/coupon-products/${id}`
      );
      fetchAll();
      openAlert(
        "success",
        "Deletion Successful",
        "Product Coupon deleted successfully."
      );
    } catch (err) {
      console.error(err);
      openAlert("error", "API Error", "Error deleting entry.");
    }
  };

  // ====================== FILTER ======================
  const validCouponProducts = couponProducts.filter(
    (item) => item.coupon !== null && item.product !== null
  );

  const filtered = validCouponProducts.filter(
    (item) =>
      item.coupon?.coupon_code
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.product?.product_name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // ====================== PAGINATION ======================
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // ====================== UI ======================
  return (
    <div className="min-h-screen p-6 bg-gray-100 flex justify-center">
      <div className="w-full max-w-4xl bg-auto rounded-lg shadow-lg p-6">

        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-700">
            🏷 Coupon Products
          </h1>

          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search coupon or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 w-64 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400"
            />

            <button
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-700"
              onClick={openAdd}
            >
              Add Coupon Product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-2xl border bg-white shadow-md">
          <table className="min-w-full text-sm">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left">SI No</th>
                <th className="px-6 py-3 text-left">Coupon Code</th>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-100 border-b transition"
                  >
                    <td className="px-6 py-3 text-center">
                      {indexOfFirstItem + index + 1}
                    </td>

                    <td className="px-6 py-3">
                      {item.coupon?.coupon_code ?? "N/A"}
                    </td>

                    <td className="px-6 py-3">
                      {item.product?.product_name ?? "N/A"}
                    </td>

                    <td className="px-6 py-3 flex gap-2 justify-center">
                      <button
                        onClick={() => openEdit(item)}
                        className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => confirmDelete(item.id)}
                        className="text-red-600 hover:bg-red-100 p-2 rounded-full"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* ADD / EDIT Modal */}
        {modalOpen && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/20 bg-opacity-30 flex justify-center items-center z-40">
            <div className="bg-white p-6 rounded-xl shadow-2xl w-96">
              <h2 className="text-xl font-semibold mb-4 text-indigo-700">
                {editId ? "Edit Coupon Product" : "Add Coupon Product"}
              </h2>

              {/* Coupon Select */}
              <label className="block mb-2">Coupon</label>
              <select
                name="coupon_id"
                value={formData.coupon_id}
                onChange={handleChange}
                className="border p-2 rounded w-full mb-4"
              >
                <option value="">Select coupon</option>
                {coupons.map((c) => (
                  <option key={c.coupon_master_id} value={c.coupon_master_id}>
                    {c.coupon_code}
                  </option>
                ))}
              </select>

              {/* Product Select */}
              <label className="block mb-2">Product</label>
              <select
                name="product_id"
                value={formData.product_id}
                onChange={handleChange}
                className="border p-2 rounded w-full mb-4"
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.product_name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded"
                >
                  {editId ? "Update" : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Alert / Confirm Modal */}
        <AlertModal
          isOpen={alertModal.isOpen}
          type={alertModal.type}
          title={alertModal.title}
          message={alertModal.message}
          onClose={closeAlert}
          onConfirm={alertModal.confirmAction}
        />
      </div>
    </div>
  );
}
