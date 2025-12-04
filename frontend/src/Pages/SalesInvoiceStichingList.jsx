import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function SalesInvoiceStitchingList() {
  const { invoice_id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const API_BASE = "http://127.0.0.1:8000/api";

  useEffect(() => {
    axios
      .get(`${API_BASE}/sales-invoices/${invoice_id}/stitching-items`)
      .then((res) => setRows(res.data))
      .catch((err) => console.error("Stitching load error:", err));
  }, [invoice_id]);

  // Table Columns
 const columns = [
  {
    name: "Invoice ID",
    selector: (row) => row.sales_invoice_id,
    sortable: true,
  },
  {
    name: "Item ID",
    selector: (row) => row.sales_invoice_item_id,
    sortable: true,
  },
  {
    name: "Customer",
    selector: (row) => row.customer?.customer_name ?? "N/A",

    sortable: true,
  },
  {
    name: "Product",
    selector: (row) => row.product?.product_name ?? "N/A",
    sortable: true,
  },
  {
    name: "Stitch Type",
    selector: (row) => row.stiching_type_name,
    sortable: true,
  },
  {
    name: "Rate",
    selector: (row) => `₹${row.rate}`,
    sortable: true,

    // ⭐ replacement for right: true
    style: { justifyContent: "flex-end" },
  },
];


  // Custom table styles
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#4F46E5",
        color: "white",
        fontSize: "14px",
        fontWeight: "bold",
        paddingTop: "12px",
        paddingBottom: "12px",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        minHeight: "52px",
      },
      highlightOnHoverStyle: {
        backgroundColor: "#EEF2FF",
        borderBottomColor: "#6366F1",
        borderRadius: "10px",
      },
    },
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="flex justify-between items-center mb-8 p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-3xl font-extrabold text-indigo-700 flex items-center gap-2">
            🧵 Stitching Items — Invoice #{invoice_id}
          </h2>

          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            ⬅ Back
          </button>
        </div>

        {/* Table Card */}
        <div className="bg-white p-6 rounded-xl shadow-xl">
          <DataTable
            columns={columns}
            data={rows}
            pagination
            highlightOnHover
            striped
            responsive
            customStyles={customStyles}
          />
        </div>
      </div>
    </div>
  );
}

export default SalesInvoiceStitchingList;
