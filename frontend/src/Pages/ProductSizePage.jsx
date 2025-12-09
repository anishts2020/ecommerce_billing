import { useEffect, useState } from "react";
import api from "../Api";

// ===== ICONS =====
const EditIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
  </svg>
);

const TrashIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
);

const AlertTriangleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
  </svg>
);

const XCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

// ===== CUSTOM ALERT =====
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;

  let icon, bgColor, buttonColor, confirmText;

  switch (type) {
    case "confirm":
      icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
      bgColor = "bg-yellow-50 border-yellow-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Yes, Delete!";
      break;
    case "success":
      icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
      bgColor = "bg-green-50 border-green-500";
      buttonColor = "bg-green-600 hover:bg-green-700";
      confirmText = "Close";
      break;
    case "error":
      icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
      bgColor = "bg-red-50 border-red-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Close";
      break;
  }

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-opacity-40 flex items-center justify-center z-50" onClick={onClose}>
      <div className={`bg-white rounded-xl shadow-xl p-6 max-w-sm w-full border-t-8 ${bgColor}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col items-center space-y-4">
          {icon}
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-center text-gray-600">{message}</p>

          <div className="flex gap-4 mt-4">
            {type === "confirm" && (
              <button className="px-4 py-2 border rounded-lg" onClick={onClose}>Cancel</button>
            )}
            <button className={`px-4 py-2 text-white rounded-lg ${buttonColor}`} onClick={onConfirm}>
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===== MAIN PAGE =====
export default function ProductSizePage() {
  const [sizes, setSizes] = useState([]);
  const [form, setForm] = useState({ size_name: "", description: "", is_active: true });
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({ size_id: "", size_name: "", description: "", is_active: true });
  const [alertState, setAlertState] = useState({ isOpen: false, title: "", message: "", type: "success", actionToRun: null });
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const closeAlert = () => setAlertState({ isOpen: false, title: "", message: "", type: "success", actionToRun: null });
  const handleAlertConfirm = () => {
    if (alertState.type === "confirm" && alertState.actionToRun) alertState.actionToRun();
    closeAlert();
  };

  // ===== Fetch Sizes =====
  const fetchSizes = async () => {
    try {
      const response = await api.get("/product-sizes");
      setSizes(response.data);
    } catch (error) {
      setAlertState({ isOpen: true, title: "Error", message: "Failed to fetch sizes", type: "error" });
    }
  };

  useEffect(() => { fetchSizes(); }, []);

  // ===== Add Product Size =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/product-sizes", form);
      setAlertState({ isOpen: true, title: "Success", message: "Size added successfully!", type: "success" });
      setForm({ size_name: "", description: "", is_active: true });
      fetchSizes();
    } catch {
      setAlertState({ isOpen: true, title: "Error", message: "Failed to add size", type: "error" });
    }
  };

  // ===== Delete Confirmation =====
  const handleDelete = (id) => {
    setAlertState({
      isOpen: true,
      title: "Are you sure?",
      message: "This size will be permanently deleted!",
      type: "confirm",
      actionToRun: async () => {
        try {
          await api.delete(`/product-sizes/${id}`);
          setAlertState({ isOpen: true, title: "Deleted", message: "Size deleted successfully!", type: "success" });
          fetchSizes();
        } catch {
          setAlertState({ isOpen: true, title: "Error", message: "Failed to delete size", type: "error" });
        }
      },
    });
  };

  // ===== Edit Modal =====
  const openEdit = (size) => { setEditData(size); setEditModal(true); };
  const updateSize = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/product-sizes/${editData.size_id}`, editData);
      setEditModal(false);
      setAlertState({ isOpen: true, title: "Success", message: "Size updated successfully!", type: "success" });
      fetchSizes();
    } catch {
      setAlertState({ isOpen: true, title: "Error", message: "Update failed", type: "error" });
    }
  };

  // ===== Filter & Pagination =====
  const filteredSizes = sizes.filter(s =>
    s.size_name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredSizes.length / itemsPerPage);
  const displayedSizes = filteredSizes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-indigo-700">
          📐 Product Size Management
        </h1>
        <input
          type="text"
          placeholder="Search by Product Size..."
          className="w-72 px-4 py-2 border border-gray-300 rounded-full shadow-sm 
                       focus:ring-2 focus:ring-indigo-300 outline-none"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* ADD FORM */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-4 space-y-4">
        <input className="border p-2 w-full rounded" placeholder="Size Name" value={form.size_name} onChange={(e)=>setForm({...form,size_name:e.target.value})} required/>
        <textarea className="border p-2 w-full rounded" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})}/>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_active} onChange={(e)=>setForm({...form,is_active:e.target.checked})}/> Active
        </label>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Size</button>
      </form>

      {/* TABLE */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2">SL No</th>
              <th className="p-2">Name</th>
              <th className="p-2">Description</th>
              <th className="p-2">Active</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedSizes.map((s, index) => (
              <tr key={s.size_id} className="text-center border-b">

                {/* SERIAL NUMBER */}
                <td className="p-2">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>

                <td className="p-2">{s.size_name}</td>
                <td className="p-2">{s.description}</td>
                <td className="p-2">{s.is_active ? "Yes" : "No"}</td>
                <td className="flex justify-center gap-2 p-2">
                  <button className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition duration-150" onClick={()=>openEdit(s)}>
                    <EditIcon className="w-4 h-4"/>
                  </button>
                  <button className="p-2 rounded-full text-red-600 hover:bg-red-100 transition duration-150" onClick={()=>handleDelete(s.size_id)}>
                    <TrashIcon className="w-4 h-4"/>
                  </button>
                </td>
              </tr>
            ))}
            {displayedSizes.length===0 && (
              <tr><td colSpan={5} className="p-4 text-center">No sizes found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages>1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button disabled={currentPage===1} onClick={()=>setCurrentPage(currentPage-1)} className="px-3 py-1 border rounded">Prev</button>
          {Array.from({length: totalPages}, (_,i)=>(<button key={i} onClick={()=>setCurrentPage(i+1)} className={`px-3 py-1 border rounded ${currentPage===i+1?'bg-blue-600 text-white':''}`}>{i+1}</button>))}
          <button disabled={currentPage===totalPages} onClick={()=>setCurrentPage(currentPage+1)} className="px-3 py-1 border rounded">Next</button>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow w-96">
            <h3 className="text-xl font-bold mb-4">Edit Size</h3>
            <form onSubmit={updateSize} className="space-y-4">
              <input className="w-full border rounded p-2" value={editData.size_name} onChange={(e)=>setEditData({...editData,size_name:e.target.value})}/>
              <textarea className="w-full border rounded p-2" value={editData.description} onChange={(e)=>setEditData({...editData,description:e.target.value})}/>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editData.is_active} onChange={(e)=>setEditData({...editData,is_active:e.target.checked})}/> Active
              </label>
              <div className="flex justify-between">
                <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Update</button>
                <button className="bg-gray-500 text-white px-4 py-2 rounded" type="button" onClick={()=>setEditModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GLOBAL ALERT */}
      <CustomAlert {...alertState} onConfirm={handleAlertConfirm} onClose={closeAlert} />
    </div>
  );  
}
