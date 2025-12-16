import { useEffect, useState, useRef } from "react";
import api, { BASE_URL } from "../Api";

/* =========================
   SVG ICONS FOR ALERT MODAL
========================= */
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

/* =========================
   CUSTOM ALERT (CENTER SCREEN)
========================= */
const CustomAlert = ({ isOpen, title, message, type, onConfirm, onClose }) => {
  if (!isOpen) return null;

  let icon, borderColor, confirmColor, confirmText;

  switch (type) {
    case "delete-confirm":
      icon = <AlertTriangleIcon className="w-12 h-12 text-yellow-500" />;
      borderColor = "border-yellow-500";
      confirmColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Delete";
      break;

    case "success":
      icon = <CheckCircleIcon className="w-12 h-12 text-green-500" />;
      borderColor = "border-green-500";
      confirmColor = "bg-green-600 hover:bg-green-700";
      confirmText = "OK";
      break;

    case "error":
      icon = <XCircleIcon className="w-12 h-12 text-red-500" />;
      borderColor = "border-red-500";
      confirmColor = "bg-red-600 hover:bg-red-700";
      confirmText = "Close";
      break;

    default:
      icon = <AlertTriangleIcon className="w-12 h-12 text-gray-500" />;
      borderColor = "border-gray-500";
      confirmColor = "bg-blue-600 hover:bg-blue-700";
      confirmText = "OK";
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 backdrop-blur-sm">
      <div className={`bg-white p-6 rounded-xl w-96 shadow-xl border-t-8 ${borderColor}`}>
        <div className="flex flex-col items-center space-y-3">
          {icon}
          <h2 className="text-xl font-bold text-center">{title}</h2>
          <p className="text-gray-600 text-center">{message}</p>
        </div>

        <div className="flex justify-center gap-3 mt-6">
          {type === "delete-confirm" && (
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-400 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
          )}

          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg shadow ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================
     MAIN COMPONENT
========================= */
export default function AddProductImages() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);

  // ALERT STATE
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "success",
    action: null,
  });

  const openAlert = (title, message, type, action = null) => {
    setAlertState({ isOpen: true, title, message, type, action });
  };

  const closeAlert = () => {
    setAlertState({ isOpen: false, title: "", message: "", type: "success", action: null });
  };

  const handleAlertConfirm = async () => {
    if (alertState.action) await alertState.action();
    closeAlert();
  };

  const fileInputRef = useRef();

  /* Load products */
  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  /* On selecting product */
  const handleProductChange = async (e) => {
    const id = e.target.value;
    const product = products.find((p) => p.product_id == id);
    setSelectedProduct(product);

    if (!id) return setCurrentImages([]);

    const res = await api.get(`/product/${id}/images`);
    setCurrentImages(res.data);
  };

  /* Upload images */
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
  };

  /* SAVE images */
  const saveImages = async () => {
    if (!selectedProduct)
      return openAlert("No Product Selected", "Please select a product", "error");
    if (images.length === 0)
      return openAlert("No Images Selected", "Select at least one image", "error");

    const formData = new FormData();
    formData.append("product_id", selectedProduct.product_id);
    images.forEach((img) => formData.append("images[]", img));

    await api.post("/product/images/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Success Alert
    openAlert("Images Uploaded", "Images saved successfully!", "success");

    setImages([]);
    setPreviewImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";

    const updated = await api.get(`/product/${selectedProduct.product_id}/images`);
    setCurrentImages(updated.data);
  };

  /* EDIT IMAGE */
  const openEditModal = (type, img) => {
    setEditTarget({ type, img });
    setEditModalOpen(true);
  };

  const updateImage = async () => {
    if (!newImageFile)
      return openAlert("No Image", "Please select a new image", "error");
  
    const formData = new FormData();
    formData.append("image", newImageFile);
  
    if (editTarget.type === "main") {
      await api.post(`/product/main-image/update/${selectedProduct.product_id}`, formData);
  
      // Refresh product so UI updates instantly
      const refreshed = await api.get(`/products/${selectedProduct.product_id}`);
      setSelectedProduct(refreshed.data);
  
    } else {
      await api.post(`/product/image/update/${editTarget.img.product_image_id}`, formData);
    }
  
    openAlert("Updated", "Image updated successfully!", "success");
  
    setEditModalOpen(false);
    setNewImageFile(null);
  
    // reload extra images
    const updated = await api.get(`/product/${selectedProduct.product_id}/images`);
    setCurrentImages(updated.data);
  };
  

  /* DELETE IMAGE */
  const deleteImage = (type, img = null) => {
    openAlert(
      "Confirm Delete",
      "Are you sure you want to delete this image?",
      "delete-confirm",
      async () => {
        if (type === "main") {
          await api.delete(`/product/main-image/delete/${selectedProduct.product_id}`);
          selectedProduct.product_image = null;
          setSelectedProduct({ ...selectedProduct });
        } else {
          await api.delete(`/product/image/delete/${img.product_image_id}`);
        }

        const updated = await api.get(`/product/${selectedProduct.product_id}/images`);
        setCurrentImages(updated.data);

        openAlert("Deleted", "Image deleted successfully!", "success");
      }
    );
  };

  /* =========================
         UI STARTS HERE
  ========================= */
  return (
    <div className="max-w-5xl mx-auto bg-white shadow-xl border rounded-xl p-8 my-10">

      <h2 className="text-3xl font-extrabold text-[#003366] mb-6 border-b pb-3">
        Add Product Images
      </h2>

      {/* PRODUCT SELECT */}
      <div className="mb-6">
        <label className="font-semibold">Select Product</label>
        <select
          className="border p-3 w-full rounded-lg mt-2"
          onChange={handleProductChange}
        >
          <option value="">-- Select Product --</option>
          {products.map((p) => (
            <option key={p.product_id} value={p.product_id}>
              {p.product_name} ({p.product_code})
            </option>
          ))}
        </select>
      </div>

      {/* PRODUCT INFO */}
      {selectedProduct && (
        <div className="p-4 border rounded-lg bg-blue-50 mb-6">
          <p><b>Name:</b> {selectedProduct.product_name}</p>
          <p><b>Code:</b> {selectedProduct.product_code}</p>
        </div>
      )}

      {/* UPLOAD IMAGES */}
      <div className="mt-4">
        <label className="font-semibold">Upload Images</label>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleImageUpload}
          className="w-full border p-3 mt-2 rounded"
        />
      </div>

      {/* PREVIEW IMAGES */}
      {previewImages.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold">Preview</h3>
          <div className="grid grid-cols-4 gap-4 mt-2">
            {previewImages.map((src, i) => (
              <img key={i} src={src} className="h-32 w-full object-cover rounded" />
            ))}
          </div>
        </div>
      )}

      <button
        onClick={saveImages}
        className="mt-6 bg-blue-700 text-white w-full py-3 rounded-lg text-lg font-semibold"
      >
        Save Images
      </button>

      {/* TABLE VIEW */}
      {(selectedProduct?.product_image || currentImages.length > 0) && (
        <div className="mt-10">
          <h3 className="text-xl font-bold mb-4">Existing Images</h3>

          <table className="w-full border rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">TYPE</th>
                <th className="border p-2">IMAGE</th>
                <th className="border p-2">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {/* MAIN IMAGE */}
              {selectedProduct?.product_image && (
                <tr>
                  <td className="border p-2 font-semibold text-center">Main Image</td>
                  <td className="border p-2">
                    <img
                      src={`${BASE_URL.replace("/api", "")}/product_images/${selectedProduct.product_image}`}
                      className="h-24 mx-auto rounded object-cover"
                    />
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => openEditModal("main", null)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => deleteImage("main")}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              )}

              {/* EXTRA IMAGES */}
              {currentImages.map((img) => (
                <tr key={img.product_image_id}>
                  <td className="border p-2 font-semibold text-center">Extra Image</td>
                  <td className="border p-2">
                    <img
                      src={`${BASE_URL.replace("/api", "")}/product_images/${img.image}`}
                      className="h-24 mx-auto rounded object-cover"
                    />
                  </td>
                  <td className="border p-2 text-center space-x-2">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => openEditModal("extra", img)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => deleteImage("extra", img)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT MODAL */}
{editModalOpen && (
  <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-xl w-96 shadow-xl">

      <h3 className="text-xl font-bold mb-4">Edit Image</h3>

      {/* CURRENT IMAGE */}
      <p className="text-sm font-semibold text-gray-600 mb-2">Current Image:</p>
      <img
        src={
          editTarget?.type === "main"
            ? `${BASE_URL.replace("/api", "")}/product_images/${selectedProduct.product_image}`
            : `${BASE_URL.replace("/api", "")}/product_images/${editTarget?.img?.image}`
        }
        className="w-full h-40 object-cover rounded mb-4 border"
      />

      {/* NEW IMAGE SELECT */}
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files[0];
          setNewImageFile(file);
        }}
        className="w-full border p-2 rounded"
      />

      {/* PREVIEW NEW IMAGE */}
      {newImageFile && (
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-600 mb-1">New Preview:</p>
          <img
            src={URL.createObjectURL(newImageFile)}
            className="w-full h-40 object-cover rounded border"
          />
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => {
            setEditModalOpen(false);
            setNewImageFile(null);
          }}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={updateImage}
        >
          Update
        </button>
      </div>
    </div>
  </div>
)}


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
