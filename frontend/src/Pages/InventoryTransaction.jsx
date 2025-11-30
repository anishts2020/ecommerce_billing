import React, { useEffect, useState } from "react";
import axios from "axios";
import AlertModal from "../Modal/AlertModal";

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
        axios.get("http://localhost:8000/api/products"),
        axios.get("http://localhost:8000/api/transaction-type"),
        axios.get("http://localhost:8000/api/reference"),
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
      const res = await axios.get(
        "http://localhost:8000/api/inventory-transactions"
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
        await axios.put(
          `http://localhost:8000/api/inventory-transactions/${editingId}`,
          payload
        );
        setAlert({
          isOpen: true,
          type: "success",
          title: "Success",
          message: "Transaction Updated Successfully",
        });
      } else {
        await axios.post(
          "http://localhost:8000/api/inventory-transactions",
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
        await axios.delete(
          `http://localhost:8000/api/inventory-transactions/${id}`
        );
        setAlert({ isOpen: false });
        fetchTransactions();
      },
    });
  };

  // -----------------------------
  // SEARCH FILTER (FIXED)
  // -----------------------------
  const filteredData = transactions.filter((tr) => {
    const s = search.toLowerCase();
    return (
      tr.product_name?.toLowerCase().includes(s) ||
      tr.transaction_type_name?.toLowerCase().includes(s) ||
      tr.reference_name?.toLowerCase().includes(s) ||
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
    <>
      <AlertModal
        isOpen={alert.isOpen}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        onConfirm={alert.onConfirm}
      />

      {/* Form */}
      <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-lg mb-10">
        <h2 className="text-xl font-bold mb-4">
          {editingId
            ? "Edit Inventory Transaction"
            : "Create Inventory Transaction"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product */}
          <div>
            <label className="block font-semibold mb-1">Product</label>
            <select
              className="w-full border rounded p-2"
              value={form.product_id}
              onChange={(e) =>
                setForm({ ...form, product_id: e.target.value })
              }
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
          <div>
            <label className="block font-semibold mb-1">
              Transaction Type
            </label>
            <select
              className="w-full border rounded p-2"
              value={form.transaction_type}
              onChange={(e) =>
                setForm({ ...form, transaction_type: e.target.value })
              }
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
          <div>
            <label className="block font-semibold mb-1">
              Reference Table
            </label>
            <select
              className="w-full border rounded p-2"
              value={form.reference_table}
              onChange={(e) =>
                setForm({ ...form, reference_table: e.target.value })
              }
            >
              <option value="">Select Reference</option>
              {references.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.reference_table}
                </option>
              ))}
            </select>
          </div>

          <input
            type="text"
            placeholder="Reference ID"
            className="w-full border rounded p-2"
            value={form.reference_id}
            onChange={(e) =>
              setForm({ ...form, reference_id: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Quantity"
            className="w-full border rounded p-2"
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Unit Cost"
            className="w-full border rounded p-2"
            value={form.unit_cost}
            onChange={(e) =>
              setForm({ ...form, unit_cost: e.target.value })
            }
          />

          <input
            type="date"
            className="w-full border rounded p-2"
            value={form.transaction_date}
            onChange={(e) =>
              setForm({ ...form, transaction_date: e.target.value })
            }
          />

          <textarea
            placeholder="Remarks"
            className="w-full border rounded p-2"
            value={form.remarks}
            onChange={(e) =>
              setForm({ ...form, remarks: e.target.value })
            }
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            {editingId ? "Update Transaction" : "Save Transaction"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="max-w-5xl mx-auto mt-6 overflow-auto">
        <div className="flex justify-between items-center mb-2">
    <h2 className="text-xl font-bold">Inventory Transactions</h2>

    <input
      type="text"
      placeholder="Search transactions..."
      className="border p-2 rounded w-72 shadow-sm"
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
      }}
    />
  </div>

        <table className="w-full border border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">SI No</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Transaction Type</th>
              <th className="border p-2">Reference Table</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Unit Cost</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Remarks</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((tr, index) => (
                <tr key={tr.inventory_id}>
                  <td className="border p-2">{(currentPage - 1) * pageSize + index + 1}</td>
                  <td className="border p-2">{tr.product_name}</td>
                  <td className="border p-2">
                    {tr.transaction_type_name}
                  </td>
                  <td className="border p-2">{tr.reference_name}</td>
                  <td className="border p-2">{tr.quantity}</td>
                  <td className="border p-2">{tr.unit_cost}</td>
                  <td className="border p-2">{tr.transaction_date}</td>
                  <td className="border p-2">{tr.remarks}</td>

                  <td className="border p-2">
                    <button
                      onClick={() => handleEdit(tr)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(tr.inventory_id)}
                      className="bg-red-600 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-3"
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
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-40"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-40"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </>
  );
}
