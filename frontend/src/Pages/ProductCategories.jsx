import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2'


function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [product_category_name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedId, setSelectedId] = useState(null);
 
 const handleSave = () => {
  const data = {
    product_category_name,
    description,
  };

  if (selectedId) {
    // UPDATE (PUT)
    axios
      .put(`http://localhost:8000/api/product-categories/${selectedId}`, data)
      .then(() => {
        fetchCategories();
        setOpenModal(false);
        setName("");
        setDescription("");
        setSelectedId(null);
         Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Category updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      })
      .catch((err) => console.log(err));

  } else {
    // ADD (POST)
    axios
      .post("http://localhost:8000/api/product-categories", data)
      .then(() => {
        fetchCategories();
        setOpenModal(false);
        setName("");
        setDescription("");
         Swal.fire({
          icon: "success",
          title: "Added!",
          text: "Category added successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      })
     .catch((err) => {
  console.log(err);

  if (err.response && err.response.status === 422) {
    const errorMsg = err.response.data.errors?.product_category_name?.[0];

    let title = "Validation Error";

    if (errorMsg?.includes("taken")) {
      title = "Duplicate!";
    }

    Swal.fire({
      icon: "error",
      title: title,
      text: errorMsg || "Validation error",
    });

    return;
  }

  Swal.fire({
    icon: "error",
    title: "Failed!",
    text: "Could not add category. Please try again.",
  });
});
 }
};


  // Fetch all categories
  const fetchCategories = () => {
    axios
      .get("http://localhost:8000/api/product-categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  };

  // Load categories when page opens
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (cat) => {
  setSelectedId(cat.product_category_id);  
  setName(cat.product_category_name);
  setDescription(cat.description);
  setOpenModal(true);
};
     

   const handleDelete = (id) => {
  Swal.fire({
    title: "Are you sure?",
    text: "This category will be deleted permanently!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      axios
        .delete(`http://localhost:8000/api/product-categories/${id}`)
        .then(() => {
          fetchCategories();
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Category deleted successfully",
            timer: 1500,
            showConfirmButton: false,
          });
        })
        .catch((err) => console.log(err));
    }
  });
};



  return (
    <div className="p-5">
      {/* Add Category Button */}
      <div className="w-full flex justify-center mb-6">
        <button
          onClick={() => {
         setSelectedId(null);     // reset edit mode
         setName("");             // clear input
         setDescription("");      // clear description
         setOpenModal(true);      // open modal
}}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md font-semibold transition"
        >
          + Add Category
        </button>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl animate-fadeIn">
            <h2 className="text-2xl font-bold mb-4 text-center">
             {selectedId ? "Edit Category" : "Add Category"}
              </h2>

            {/* Category Name */}
            <input
              type="text"
              placeholder="Enter category name"
              value={product_category_name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-3 w-full mb-4 rounded-xl" 
            />

            {/* Description */}
            <label className="text-gray-700 font-medium">Description</label>
            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 p-3 w-full rounded-xl h-24"
            />

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setOpenModal(false)}
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition"
              >
                Close
              </button>

              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Categories Table */}
<div className="mt-10">
  <h3 className="text-xl font-semibold mb-4 text-center">Category List</h3>

  <table className="w-full border-collapse shadow-md rounded-lg overflow-hidden">
    <thead>
      <tr className="bg-gray-200 text-left">
        <th className="p-3 border">ID</th>
        <th className="p-3 border">Category Name</th>
        <th className="p-3 border">Description</th>
        <th className="p-3 border">Action</th>
      </tr>
    </thead>

    <tbody>
      {categories.length > 0 ? (
        categories.map((cat) => (
          <tr key={cat.product_category_id} className="hover:bg-gray-100">
            <td className="p-3 border">{cat.product_category_id}</td>
            <td className="p-3 border">{cat.product_category_name}</td>
            <td className="p-3 border">{cat.description}</td>
            <td className="p-3 border text-center">
              <div className="flex justify-center items-center gap-3">
               <button
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg shadow hover:bg-blue-700 transition"
                  onClick={() => handleEdit(cat)}
                  >
                Edit
             </button>

             <button
               className="bg-red-500 text-white px-4 py-1.5 rounded-lg shadow hover:bg-red-600 transition"
               onClick={() =>
               handleDelete(cat.product_category_id)
               }
               >
               Delete
              </button>
             </div>
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
    </div>
  );
}

export default ProductCategories;
