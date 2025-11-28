import { useState, useEffect } from "react";
import axios from "axios";

/* --------------------- SVG Icons --------------------- */
const AlertTriangleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const XCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/* --------------------- ALERT COMPONENTS --------------------- */
const CustomAlert = ({ isOpen, title, message, type, onClose }) => {
  if (!isOpen) return null;

  let icon, bgColor, buttonColor;

  switch (type) {
    case "success":
      icon = <CheckCircleIcon className="w-10 h-10 text-green-500" />;
      bgColor = "bg-green-50 border-green-500";
      buttonColor = "bg-green-600 hover:bg-green-700";
      break;
    case "error":
      icon = <XCircleIcon className="w-10 h-10 text-red-500" />;
      bgColor = "bg-red-50 border-red-500";
      buttonColor = "bg-red-600 hover:bg-red-700";
      break;
    default:
      icon = <AlertTriangleIcon className="w-10 h-10 text-yellow-500" />;
      bgColor = "bg-yellow-50 border-yellow-500";
      buttonColor = "bg-yellow-600 hover:bg-yellow-700";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" onClick={onClose}>
      <div className={`bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border-t-8 ${bgColor}`} onClick={(e) => e.stopPropagation()}>
        <div className="text-center space-y-4">
          {icon}
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-gray-600">{message}</p>
        </div>
        <div className="mt-6 flex justify-center">
          <button onClick={onClose} className={`px-4 py-2 text-white rounded-lg ${buttonColor}`}>OK</button>
        </div>
      </div>
    </div>
  );
};

/* Delete Confirm Alert with SVGs */
const DeleteConfirmAlert = ({ isOpen, colorName, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border-t-8 border-red-500" onClick={(e) => e.stopPropagation()}>
        <div className="text-center space-y-4">
          <XCircleIcon className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold">Confirm Delete</h2>
          <p className="text-gray-600">Are you sure you want to delete <strong>{colorName}</strong>?</p>
        </div>
        <div className="mt-6 flex justify-center gap-4">
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">Delete</button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg">Cancel</button>
        </div>
      </div>
    </div>
  );
};

/* --------------------- COLORS COMPONENT --------------------- */
export default function Colors() {
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState({ value: "", code: "", id: null });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ isOpen: false, title: "", message: "", type: "success" });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, id: null, colorName: "" });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  const openAlert = (title, message, type = "success") => setAlert({ isOpen: true, title, message, type });
  const closeAlert = () => setAlert({ ...alert, isOpen: false });
  const openDeleteConfirm = (id, colorName) => setDeleteConfirm({ isOpen: true, id, colorName });
  const closeDeleteConfirm = () => setDeleteConfirm({ isOpen: false, id: null, colorName: "" });

  const fetchColors = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/colors", { params: { page, search } });
      setColors(res.data.data || []);
      setCurrentPage(res.data.current_page || 1);
      setLastPage(res.data.last_page || 1);
    } catch (err) {
      openAlert("Error Loading Colors", "Failed to load color list.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchColors(currentPage, searchTerm); }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchColors(1, e.target.value);
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > lastPage) return;
    fetchColors(page, searchTerm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedColor.value || !selectedColor.code) { openAlert("Missing Fields", "Color name and code are required.", "error"); return; }
    try {
      if (selectedColor.id) {
        await axios.put(`http://127.0.0.1:8000/api/colors/${selectedColor.id}`, {
          color_name: selectedColor.value, color_code: selectedColor.code
        });
        openAlert("Updated!", "Color updated successfully.", "success");
      } else {
        await axios.post("http://127.0.0.1:8000/api/colors", {
          color_name: selectedColor.value, color_code: selectedColor.code, is_active: 1
        });
        openAlert("Saved!", "Color added successfully.", "success");
      }
      setSelectedColor({ value: "", code: "", id: null });
      fetchColors(currentPage, searchTerm);
    } catch (err) {
      console.log(err.response?.data);
      openAlert("Save Failed", "Failed to save the color.", "error");
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirm.id) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/colors/${deleteConfirm.id}`);
      openAlert("Deleted!", "Color deleted successfully.", "success");
      fetchColors(currentPage, searchTerm);
    } catch (err) {
      openAlert("Delete Failed", "Failed to delete color.", "error");
    } finally {
      closeDeleteConfirm();
    }
  };

  const handleEdit = (color) => {
    setSelectedColor({ value: color.color_name, code: color.color_code, id: color.color_id });
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Color Management</h2>

      {/* Search */}
      <input type="text" placeholder="Search colors..." className="border p-2 rounded mb-4 w-full" value={searchTerm} onChange={handleSearch} />

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-8 grid gap-4">
        <input type="text" placeholder="Enter Color Name" className="border p-2 rounded" value={selectedColor.value} onChange={(e) => setSelectedColor({ ...selectedColor, value: e.target.value })} required />
        <input type="text" placeholder="#RRGGBB" className="border p-2 rounded" value={selectedColor.code} onChange={(e) => setSelectedColor({ ...selectedColor, code: e.target.value })} required />
        {selectedColor.code && <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded" style={{ backgroundColor: selectedColor.code }}></div>
          <p className="font-semibold">{selectedColor.code}</p>
        </div>}
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">{selectedColor.id ? "Update Color" : "Save Color"}</button>
      </form>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-2">Color Name</th>
              <th className="p-2">Color Code</th>
              <th className="p-2">Active</th>
              <th className="p-2">Preview</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center">Loading colors...</td></tr>
            ) : colors.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center">No colors found.</td></tr>
            ) : colors.map(c => (
              <tr key={c.color_id} className="border-b text-center hover:bg-gray-100">
                <td>{c.color_name}</td>
                <td>{c.color_code}</td>
                <td>{c.is_active ? "Yes" : "No"}</td>
                <td><div className="w-6 h-6 mx-auto rounded" style={{ backgroundColor: c.color_code }}></div></td>
                <td className="flex justify-center gap-2">
                  <button onClick={() => handleEdit(c)} className="bg-yellow-500 px-2 py-1 rounded hover:bg-yellow-600 text-white">Edit</button>
                  <button onClick={() => openDeleteConfirm(c.color_id, c.color_name)} className="bg-red-500 px-2 py-1 rounded hover:bg-red-600 text-white">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2">
        <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
        <span className="px-3 py-1">{currentPage} / {lastPage}</span>
        <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === lastPage}>Next</button>
      </div>

      {/* Alerts */}
      <CustomAlert isOpen={alert.isOpen} title={alert.title} message={alert.message} type={alert.type} onClose={closeAlert} />
      <DeleteConfirmAlert isOpen={deleteConfirm.isOpen} colorName={deleteConfirm.colorName} onConfirm={handleDeleteConfirmed} onClose={closeDeleteConfirm} />
    </div>
  );
}
