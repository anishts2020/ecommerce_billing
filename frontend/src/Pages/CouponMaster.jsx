import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import api from "../Api";

/* ---------- axios base ---------- */

/* ---------- Icons ---------- */
const AlertTriangleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const XCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/* ---------- Alert Component ---------- */
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;
  let icon, borderColor, buttonColor, confirmText;
  switch (type) {
    case "delete-confirm":
      icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
      borderColor = "border-yellow-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Yes, Delete";
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
    <div onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div onClick={(e) => e.stopPropagation()} className={`bg-white p-6 rounded-xl w-96 border-t-8 shadow-xl ${borderColor}`}>
        <div className="flex flex-col items-center space-y-4">
          {icon}
          <h1 className="text-xl font-bold text-center">{title}</h1>
          <p className="text-gray-600 text-center">{message}</p>
        </div>
        <div className="flex justify-center gap-3 mt-6">
          {type === "delete-confirm" && (
            <button onClick={onClose} className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100">Cancel</button>
          )}
          <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-lg shadow ${buttonColor}`}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
};

/* ---------- Coupons Master Component ---------- */
export default function CouponsMaster() {
  const [coupons, setCoupons] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [alertState, setAlertState] = useState({ isOpen: false, title: "", message: "", type: "success", actionToRun: null });

  const initialForm = {
    coupon_code: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_amount: "",
    max_discount_amount: "",
    usage_limit: "",
    usage_limit_per_user: "",
    valid_from: "",
    valid_to: "",
    status: "active",
  };
  const [form, setForm] = useState(initialForm);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------- Helpers ---------- */
  const toApiPayload = (f) => ({
    coupon_code: f.coupon_code?.trim() || "",
    description: f.description || null,
    discount_type: f.discount_type === "fixed" ? 1 : 0,
    discount_value: f.discount_value === "" ? null : parseFloat(f.discount_value),
    minimum_order_amount: f.min_order_amount === "" ? null : parseFloat(f.min_order_amount),
    maximum_discount_amount: f.max_discount_amount === "" ? null : parseFloat(f.max_discount_amount),
    usage_limit: f.usage_limit === "" ? null : parseInt(f.usage_limit, 10),
    usage_limit_per_user: f.usage_limit_per_user === "" ? null : parseInt(f.usage_limit_per_user, 10),
    valid_from: f.valid_from || null,
    valid_to: f.valid_to || null,
    is_active: f.status === "active" ? 1 : 0,
  });

  // Defensive server -> form mapping (handle "1", 1, true, etc.)
  const serverToForm = (c) => ({
    coupon_code: c.coupon_code || "",
    description: c.description || "",
    discount_type: Number(c.discount_type) === 1 ? "fixed" : "percentage",
    discount_value: c.discount_value != null ? String(c.discount_value) : "",
    min_order_amount: c.minimum_order_amount != null ? String(c.minimum_order_amount) : "",
    max_discount_amount: c.maximum_discount_amount != null ? String(c.maximum_discount_amount) : "",
    usage_limit: c.usage_limit != null ? String(c.usage_limit) : "",
    usage_limit_per_user: c.usage_limit_per_user != null ? String(c.usage_limit_per_user) : "",
    valid_from: c.valid_from ? c.valid_from.split("T")[0] : "",
    valid_to: c.valid_to ? c.valid_to.split("T")[0] : "",
    status: Number(c.is_active) === 1 ? "active" : "inactive",
  });

  /* ---------- Fetch Coupons ---------- */
  const fetchCoupons = async () => {
    try {
      const res = await api.get("/coupons");
      const data = res.data;
      setCoupons(data.data || data); // Laravel paginator or raw array
    } catch (e) {
      console.error(e);
      setAlertState({ isOpen: true, title: "Error", message: "Failed to load coupons.", type: "error" });
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  /* ---------- Alerts ---------- */
  const closeAlert = () => setAlertState({ isOpen: false, title: "", message: "", type: "success", actionToRun: null });
  const handleAlertConfirm = () => { if (alertState.actionToRun) alertState.actionToRun(); closeAlert(); };

  /* ---------- Modal ---------- */
  const openAddModal = () => { setSelectedId(null); setForm({ ...initialForm }); setOpenModal(true); };
  const openEditModal = (c) => {
    // debug log if needed:
    // console.log("openEditModal", c.coupon_master_id, "is_active:", c.is_active);
    setSelectedId(c.coupon_master_id);
    setForm(serverToForm(c));
    setOpenModal(true);
  };

  /* ---------- Save ---------- */
  const handleSave = async () => {
    if (!form.coupon_code.trim()) return setAlertState({ isOpen: true, title: "Validation", message: "Coupon code is required.", type: "error" });
    if (!form.discount_value || Number(form.discount_value) <= 0) return setAlertState({ isOpen: true, title: "Validation", message: "Discount value must be greater than zero.", type: "error" });
    if (form.valid_from && form.valid_to && new Date(form.valid_from) > new Date(form.valid_to)) return setAlertState({ isOpen: true, title: "Validation", message: "Valid From must be before Valid To.", type: "error" });

    setLoading(true);
    try {
      const payload = toApiPayload(form);
      if (selectedId) await api.put(`/coupons/${selectedId}`, payload);
      else await api.post(`/coupons`, payload);
      setAlertState({ isOpen: true, title: selectedId ? "Updated" : "Created", message: `Coupon ${selectedId ? "updated" : "created"} successfully.`, type: "success" });
      setOpenModal(false); setForm(initialForm); fetchCoupons();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || (err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : "Failed to save coupon.");
      setAlertState({ isOpen: true, title: "Error", message: msg, type: "error" });
    } finally { setLoading(false); }
  };

  /* ---------- Delete ---------- */
  const deleteCoupon = async (id) => {
    try {
      await api.delete(`/coupons/${id}`);
      setAlertState({ isOpen: true, title: "Deleted", message: "Coupon deleted.", type: "success" });
      fetchCoupons();
    } catch (e) {
      console.error(e);
      setAlertState({ isOpen: true, title: "Error", message: "Delete failed.", type: "error" });
    }
  };
  const handleDelete = (id) => setAlertState({ isOpen: true, title: "Confirm Deletion", message: "Delete this coupon permanently?", type: "delete-confirm", actionToRun: () => deleteCoupon(id) });

  /* ---------- Toggle Status ---------- */
  const toggleStatus = async (c) => {
    const id = c.coupon_master_id;
    const prevActive = Number(c.is_active) === 1 ? 1 : 0;

    // optimistic update
    setCoupons(prevList => prevList.map(item => {
      if (item.coupon_master_id === id) {
        const newActive = prevActive ? 0 : 1;
        return { ...item, is_active: newActive };
      }
      return item;
    }));

    try {
      // call API to toggle. If your backend expects explicit payload you can send it; here we're hitting a patch endpoint
      await api.patch(`/coupons/${id}/toggle-status`);
      setAlertState({ isOpen: true, title: "Updated", message: "Status updated.", type: "success" });
      // refetch or keep optimistic state - here we keep optimistic state but you can call fetchCoupons() instead
    } catch (err) {
      console.error(err);
      // revert on error
      setCoupons(prevList => prevList.map(item => item.coupon_master_id === id ? { ...item, is_active: prevActive } : item));
      setAlertState({ isOpen: true, title: "Error", message: "Failed to update status.", type: "error" });
    }
  };

  /* ---------- Filter & Pagination ---------- */
  const filtered = coupons.filter(c => {
    if (!searchText) return true;
    const s = searchText.toLowerCase();
    return (c.coupon_code || "").toLowerCase().includes(s) || (c.description || "").toLowerCase().includes(s);
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const current = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  /* ---------- Render ---------- */
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {openModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[900px] max-w-full shadow-2xl relative">
            <button className="absolute top-3 right-3 text-xl font-bold text-gray-400 hover:text-gray-600" onClick={() => setOpenModal(false)}>×</button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">{selectedId ? "Edit Coupon" : "Add Coupon"}</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Coupon Code</label>
                <input value={form.coupon_code} onChange={e => setForm({ ...form, coupon_code: e.target.value.toUpperCase() })} className="border p-2 w-full rounded-lg mt-1" placeholder="E.g. SUMMER25" />
              </div>

              <div>
                <label className="text-sm font-medium">Description</label>
                <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="border p-2 w-full rounded-lg mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Discount Type</label>
                <select value={form.discount_type} onChange={e => setForm({ ...form, discount_type: e.target.value })} className="border p-2 w-full rounded-lg mt-1">
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Discount Value</label>
                <input type="number" min="0" value={form.discount_value} onChange={e => setForm({ ...form, discount_value: e.target.value })} className="border p-2 w-full rounded-lg mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Min Order Amount</label>
                <input type="number" min="0" value={form.min_order_amount} onChange={e => setForm({ ...form, min_order_amount: e.target.value })} className="border p-2 w-full rounded-lg mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Max Discount Amount</label>
                <input type="number" min="0" value={form.max_discount_amount} onChange={e => setForm({ ...form, max_discount_amount: e.target.value })} className="border p-2 w-full rounded-lg mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Usage Limit</label>
                <input type="number" min="0" value={form.usage_limit} onChange={e => setForm({ ...form, usage_limit: e.target.value })} className="border p-2 w-full rounded-lg mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Usage Limit Per User</label>
                <input type="number" min="0" value={form.usage_limit_per_user} onChange={e => setForm({ ...form, usage_limit_per_user: e.target.value })} className="border p-2 w-full rounded-lg mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Valid From</label>
                <input type="date" value={form.valid_from} onChange={e => setForm({ ...form, valid_from: e.target.value })} className="border p-2 w-full rounded-lg mt-1" />
              </div>

              <div>
                <label className="text-sm font-medium">Valid To</label>
                <input type="date" value={form.valid_to} onChange={e => setForm({ ...form, valid_to: e.target.value })} className="border p-2 w-full rounded-lg mt-1" />
              </div>

              <div className="flex items-center gap-3 col-span-2">
                <label className="text-sm font-medium">Status:</label>
                <div
                  role="button"
                  onClick={() => setForm({ ...form, status: form.status === "active" ? "inactive" : "active" })}
                  className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition ${form.status === "active" ? "bg-green-500 justify-end" : "bg-gray-400 justify-start"}`}
                >
                  <div className="bg-white w-5 h-5 rounded-full shadow" />
                </div>
            
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setOpenModal(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">Close</button>
              <button onClick={handleSave} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">{loading ? 'Saving...' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center p-4 bg-white rounded-xl shadow-lg mb-6">
          <h1 className="text-3xl font-extrabold text-indigo-700">🎟️ Coupon Master</h1>
          <div className="flex items-center gap-4">
            <input type="text" placeholder="Search..." value={searchText} onChange={e => { setSearchText(e.target.value); setCurrentPage(1); }} className="border p-2 w-64 rounded-xl shadow-sm" />
            <button onClick={openAddModal} className="bg-blue-600 text-white px-6 py-2 rounded-lg">+ Add Coupon</button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-bold">Sl No.</th>
                <th className="py-3 px-4 text-left text-sm font-bold">Code</th>
                <th className="py-3 px-4 text-left text-sm font-bold">Valid From</th>
                <th className="py-3 px-4 text-left text-sm font-bold">Valid to</th>
                <th className="py-3 px-4 text-left text-sm font-bold">Discount</th>
                <th className="py-3 px-4 text-center text-sm font-bold">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {current.length > 0 ? current.map((c, index) => {
                const key = c.coupon_master_id;
                const statusText = Number(c.is_active) === 1 ? "Active" : "Inactive";

                return (
                  <tr key={key} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="py-3 px-4 text-sm font-medium">{c.coupon_code}</td>
                    <td className="py-3 px-4 text-sm">{c.valid_from ? c.valid_from.split("T")[0] : "-"}</td>
                    <td className="py-3 px-4 text-sm">{c.valid_to ? c.valid_to.split("T")[0] : "-"}</td>
                    <td className="py-3 px-4 text-sm font-medium">
                      {Number(c.discount_type) === 1 ? "₹" + c.discount_value : c.discount_value + "%"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <button onClick={() => openEditModal(c)} className="text-indigo-600 hover:bg-indigo-100 p-2 rounded-full" title="Edit">
                          <FaEdit className="w-4 h-4"/>
                        </button>

                        <button onClick={() => handleDelete(key)} className="text-red-600 hover:bg-red-100 p-2 rounded-full" title="Delete">
                          <FaTrash className="w-4 h-4"/>
                        </button>

                       
                      </div>
                    </td>
                  </tr>
                );
              }) : <tr><td colSpan={6} className="text-center py-8 text-gray-500">No coupons found</td></tr>}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-center items-center p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-1 text-sm">
                <button onClick={() => setCurrentPage(p => Math.max(p-1,1))} disabled={currentPage===1} className={`px-4 py-2 rounded-lg border ${currentPage===1?'text-gray-400 bg-gray-100':'text-blue-600 border-blue-600 hover:bg-blue-50'}`}>Prev</button>
                <span className="px-4 py-2 border bg-blue-600 text-white rounded-lg">{currentPage}</span>
                <button onClick={() => setCurrentPage(p => Math.min(p+1,totalPages))} disabled={currentPage===totalPages} className={`px-4 py-2 rounded-lg border ${currentPage===totalPages?'text-gray-400 bg-gray-100':'text-blue-600 border-blue-600 hover:bg-blue-50'}`}>Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <CustomAlert isOpen={alertState.isOpen} title={alertState.title} message={alertState.message} type={alertState.type} onConfirm={handleAlertConfirm} onClose={closeAlert} />
    </div>
  );
}
