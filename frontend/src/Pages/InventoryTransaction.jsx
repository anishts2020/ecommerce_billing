import React, { useEffect, useState } from "react";
import AlertModal from "../Modal/AlertModal";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../Api";

export default function InventoryTransaction() {
  const [products, setProducts] = useState([]);
  const [transactionTypes, setTransactionTypes] = useState([]);
  const [references, setReferences] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [alert, setAlert] = useState({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
    onConfirm: null,
  });

  const [editingId, setEditingId] = useState(null);

  // SEARCH + PAGINATION STATES
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const [form, setForm] = useState({
    product_id: "",
    transaction_type: "",
    reference_table: "",
    reference_id: "",
    quantity: "",
    unit_cost: "",
    transaction_date: "",
    remarks: "",
    created_by: 1,
  });

  useEffect(() => {
    fetchDropdownData();
    fetchTransactions();
  }, []);

  const fetchDropdownData = async () => {
    try {
      const [prodRes, typeRes, refRes] = await Promise.all([
        api.get("/products"),
        api.get("/transaction-type"),
        api.get("/reference"),
      ]);
      setProducts(prodRes.data);
      setTransactionTypes(typeRes.data);
      setReferences(refRes.data);
    } catch {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to load dropdowns.",
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get(
        "/inventory-transactions"
      );
      setTransactions(res.data);
    } catch {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Error",
        message: "Failed to load transactions.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.product_id ||
      !form.transaction_type ||
      !form.reference_table ||
      !form.quantity ||
      !form.unit_cost ||
      !form.transaction_date
    ) {
      setAlert({
        isOpen: true,
        type: "error",
        title: "Failed",
        message: "Please fill all required fields.",
      });
      return;
    }

    try {
      const payload = {
        ...form,
        product_id: parseInt(form.product_id),
        transaction_type: parseInt(form.transaction_type),
        reference_table: parseInt(form.reference_table),
        reference_id: form.reference_id
          ? parseInt(form.reference_id)
          : null,
        quantity: parseInt(form.quantity),
        unit_cost: parseFloat(form.unit_cost),
      };

      if (editingId) {
        await api.put(
          `/inventory-transactions/${editingId}`,
          payload
        );
        setAlert({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Transaction Updated Successfully",
        });
      } else {
        await api.post(
          "/inventory-transactions",
          payload
        );
        setAlert({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Transaction Created Successfully",
        });
      }

      fetchTransactions();
      resetForm();
    } catch (err) {
      const msg = err.response?.data?.errors
        ? Object.values(err.response.data.errors)
            .flat()
            .join(", ")
        : "Failed to save transaction.";
      setAlert({ isOpen: true, type: "error", title: "Failed", message: msg });
    }
  };

  const resetForm = () => {
    setForm({
      product_id: "",
      transaction_type: "",
      reference_table: "",
      reference_id: "",
      quantity: "",
      unit_cost: "",
      transaction_date: "",
      remarks: "",
      created_by: 1,
    });
    setEditingId(null);
  };

  const handleEdit = (tr) => {
    setForm({
      product_id: tr.product_id,
      transaction_type: tr.transaction_type,
      reference_table: tr.reference_table,
      reference_id: tr.reference_id,
      quantity: tr.quantity,
      unit_cost: tr.unit_cost,
      transaction_date: tr.transaction_date,
      remarks: tr.remarks,
      created_by: tr.created_by,
    });
    setEditingId(tr.inventory_id);
  };

  const handleDelete = async (id) => {
    setAlert({
      isOpen: true,
      type: "delete-confirm",
      title: "Are you sure?",
      message: "This inventory transaction will be permanently deleted",
      onConfirm: async () => {
        await api.delete(
          `/inventory-transactions/${id}`
        );
        setAlert({ isOpen: false });
        fetchTransactions();
      },
    });
  };

  const validTransactions = transactions.filter(
    (tr) =>
      tr.product_name
  );

  // -----------------------------
  // SEARCH FILTER (FIXED)
  // -----------------------------
  const filteredData = validTransactions.filter((tr) => {
    const s = search.toLowerCase();
    return (
      tr.product_name?.toLowerCase().includes(s) ||
      tr.remarks?.toLowerCase().includes(s)
    );
  });

  // PAGINATION
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
  <div className="bg-gray-50 min-h-screen">
    <AlertModal
      isOpen={alert.isOpen}
      type={alert.type}
      title={alert.title}
      message={alert.message}
      onClose={() => setAlert({ ...alert, isOpen: false })}
      onConfirm={alert.onConfirm}
    />

    {/* HEADER BAR */}
    <div className="max-w-6xl mx-auto mb-6">
      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg">
        <div>
          <h1 className="text-3xl font-extrabold text-indigo-700">
            📄 Inventory Transactions
          </h1>
        </div>
      </div>
    </div>

      {/* Form */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#1e3a8a] mb-6 text-center">
              {editingId ? "Edit Inventory Transaction" : "Add Inventory Transaction"}
            </h2>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              {/* FLEX WRAPPER FOR 2 COLUMNS */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "20px",
                  width: "100%",
                }}
              >
                {/* Product */}
                <div style={{ flex: "1 1 48%" }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Product
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    value={form.product_id}
                    onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                  >
                    <option value="">Select Product</option>
                    {products.map((p) => (
                      <option key={p.product_id} value={p.product_id}>
                        {p.product_name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Transaction Type */}
                <div style={{ flex: "1 1 48%" }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Transaction Type
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    value={form.transaction_type}
                    onChange={(e) => setForm({ ...form, transaction_type: e.target.value })}
                  >
                    <option value="">Select Type</option>
                    {transactionTypes.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.transaction_type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reference Table */}
                <div style={{ flex: "1 1 48%" }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Reference Table
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    value={form.reference_table}
                    onChange={(e) => setForm({ ...form, reference_table: e.target.value })}
                  >
                    <option value="">Select Reference</option>
                    {references.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.reference_table}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reference ID */}
                <div style={{ flex: "1 1 48%" }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Reference ID
                  </label>
                  <input
                    type="text"
                    placeholder="Reference ID"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    value={form.reference_id}
                    onChange={(e) => setForm({ ...form, reference_id: e.target.value })}
                  />
                </div>

                {/* Quantity */}
                <div style={{ flex: "1 1 48%" }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Quantity"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  />
                </div>

                {/* Unit Cost */}
                <div style={{ flex: "1 1 48%" }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Unit Cost
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Unit Cost"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    value={form.unit_cost}
                    onChange={(e) => setForm({ ...form, unit_cost: e.target.value })}
                  />
                </div>

                {/* Transaction Date */}
                <div style={{ flex: "1 1 48%" }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    value={form.transaction_date}
                    onChange={(e) =>
                      setForm({ ...form, transaction_date: e.target.value })
                    }
                  />
                </div>

                {/* Remarks */}
                <div style={{ flex: "1 1 48%" }}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Remarks
                  </label>
                  <textarea
                    placeholder="Remarks"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    value={form.remarks}
                    onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  />
                </div>
              </div>

              {/* Button full width */}
              <div className="mt-6 flex justify-center" style={{ width: "100%" }}>
                <button
                  type="submit"
                  className="md:w-auto px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold 
               rounded-full shadow hover:bg-blue-700 transition-colors"
                >
                  {editingId ? "Update Transaction" : "Save Transaction"}
                </button>
              </div>
            </form>


          </div>
        </div>


            {/* TABLE CARD */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-xl p-4">
          {/* Header + Search */}
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-bold text-[#27204b]">
              Inventory Transactions
            </h2>

            <input
              type="text"
              placeholder="Search transactions..."
              value={search}
              onChange={(e) => {
                setSearchText(e.target.value);
                setCurrentPage(1);
              }}
              className="border p-2 w-64 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#4c30ff] text-white text-left">
                  <th className="px-4 py-2 rounded-tl-lg">SI No</th>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Transaction Type</th>
                  <th className="px-4 py-2">Reference</th>
                  <th className="px-4 py-2 text-right">Quantity</th>
                  <th className="px-4 py-2 text-right">Unit Cost</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Remarks</th>
                  <th className="px-4 py-2 rounded-tr-lg text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((tr, index) => (
                    <tr
                      key={tr.inventory_id}
                      className="border-b last:border-0 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-2 text-gray-700">
                        {(currentPage - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-800">
                        {tr.product_name}
                      </td>
                      <td className="px-4 py-2">
                        <span className="px-4 py-2 font-medium text-gray-800 ">
                          {tr.transaction_type_name}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {tr.reference_name}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-800">
                        {tr.quantity}
                      </td>
                      <td className="px-4 py-2 text-right text-gray-800">
                        ₹{tr.unit_cost}
                      </td>
                      <td className="px-4 py-2 text-gray-700">
                        {tr.transaction_date}
                      </td>
                      <td className="px-4 py-2 text-gray-600">
                        {tr.remarks}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleEdit(tr)}
                          className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full transition duration-150"
                          title="Edit"
                        >
                          <FaEdit className="w-5 h-5"/>
                        </button>
                        <button
                          onClick={() => handleDelete(tr.inventory_id)}
                          className="text-red-600 hover:bg-red-100 p-2 rounded-full transition duration-150"
                          title="Delete"
                        >
                          <FaTrash className="w-5 h-5"/>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-4 text-center text-gray-500"
                    >
                      No matching records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center items-center mt-4 gap-2">
            <button
              className="px-3 py-1 rounded-full bg-gray-200 text-sm disabled:opacity-40"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-full text-sm ${
                  currentPage === i + 1
                    ? "bg-[#4c30ff] text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="px-3 py-1 rounded-full bg-gray-200 text-sm disabled:opacity-40"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
);
}
