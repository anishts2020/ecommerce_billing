import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// ⭐ Material UI imports
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Card,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Button,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function Order() {
  const API_URL = "http://127.0.0.1:8000/api/orders";
  const navigate = useNavigate();

  // ORDER FORM STATE
  const [form, setForm] = useState({
    order_no: "",
    user_id: "",
    total_amount: "",
    gst_amount: "",
    grand_total: "",
    payment_status: "pending",
    payment_mode: "",        // ⭐ IMPORTANT
    order_status: "processing",
    billing_address: "",
    shipping_address: "",
     items: []
  });

  const [expanded, setExpanded] = useState("flipkart_upi");
  

  useEffect(() => {
  const pendingOrder = JSON.parse(sessionStorage.getItem("pending_order"));

  if (!pendingOrder) {
    alert("Order data missing. Please go back.");
    navigate("/cart");
    return;
  }

  setForm((prev) => ({
    ...prev,
    user_id: 1,                      // ✅ dummy user id (VISIBLE)
    total_amount: pendingOrder.total_amount,
    gst_amount: pendingOrder.gst_amount,
    grand_total: pendingOrder.grand_total,
    billing_address: pendingOrder.billing_address,
    shipping_address: pendingOrder.shipping_address,
    items: pendingOrder.items        // ✅ CRITICAL
  }));
}, []);


  // PAYMENT STATE
  const [upiApp, setUpiApp] = useState("");
  const [card, setCard] = useState({
    number: "",
    expiry: "",
    cvv: ""
  });

  useEffect(() => {
    fetchOrderNo();
  }, []);

  const fetchOrderNo = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/orders/generate-order-no");
      if (res.data && res.data.order_no) {
        setForm(prev => ({ ...prev, order_no: res.data.order_no }));
      }
    } catch (error) {
      console.error("Error fetching order number:", error);
      setForm(prev => ({ 
        ...prev, 
        order_no: `ORD-${Math.floor(1000 + Math.random() * 9000)}` 
      }));
    }
  };

  const amount = form.grand_total || 0;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const upiMap = {
  googlepay: "upi/gpay",
  paytm: "upi/paytm",
  newupi: "upi/new"
};

  // ⭐ SUBMIT ORDER
  const submitOrder = async (e) => {
  e.preventDefault();

  if (!form.payment_mode) {
    alert("Please select a payment method!");
    return;
  }

  try {
    const response = await axios.post(API_URL, form);
    alert("Order Created Successfully!");

    // ⭐ PRINT PAYMENT MODE BEFORE NAVIGATION
    console.log("FORM PAYMENT MODE:", form.payment_mode);

    // ⭐ CORRECT WORKING NAVIGATE
    navigate("/payment", { 
      state: {
        orderId: response.data.order_id,
        orderNo: response.data.order_no,
        amount: response.data.amount,
        paymentMode: form.payment_mode   // THIS NOW WORKS
      }
    });

  } catch (error) {
    alert("Error creating order!");
    console.log(error);
  }
};


  const handleAccordion = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div style={pageContainer}>
      <h2 style={title}>Create Order</h2>

      <form onSubmit={submitOrder} style={formCard}>

        {/* ORDER DETAILS */}
        <h3 style={sectionTitle}>Order Details</h3>

        <div style={{ marginBottom: "10px" }}>
          <label>Order No:</label>
          <input
            type="text"
            name="order_no"
            value={form.order_no}
            readOnly
            style={readOnlyInput}
          />
        </div>

        <div style={fieldBox}>
          <label style={label}>User ID</label>
          <input type="number" name="user_id" value={form.user_id} onChange={handleChange} style={input} required />
        </div>

        {/* AMOUNT DETAILS */}
        <h3 style={sectionTitle}>Amount Details</h3>

        <div style={fieldBox}>
          <label style={label}>Total Amount</label>
          <input type="number" name="total_amount" value={form.total_amount} readOnly
  style={readOnlyInput} onChange={handleChange} />
        </div>

        <div style={fieldBox}>
          <label style={label}>GST Amount</label>
          <input type="number" name="gst_amount" value={form.gst_amount} onChange={handleChange} readOnly
  style={readOnlyInput} />
        </div>

        <div style={fieldBox}>
          <label style={label}>Grand Total</label>
          <input type="number" name="grand_total" value={form.grand_total} onChange={handleChange} readOnly
  style={readOnlyInput} />
        </div>

        {/* PAYMENT SECTION */}
        <h3 style={sectionTitle}>Payment Options</h3>

        {/* FLIPKART UPI */}
        <Accordion expanded={expanded === "flipkart_upi"} onChange={handleAccordion("flipkart_upi")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">Flipkart UPI</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Button
              fullWidth
              variant="contained"
              sx={{ background: "#1976d2", fontWeight: "bold" }}
              onClick={() => setForm({ ...form, payment_mode: "flipkart_upi" })}
            >
              Add Bank and Pay
            </Button>
          </AccordionDetails>
        </Accordion>

        {/* UPI OPTIONS */}
        <Accordion expanded={expanded === "upi"} onChange={handleAccordion("upi")} sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">UPI</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <RadioGroup
              value={upiApp}
             onChange={(e) => {
  const selected = e.target.value;
  setUpiApp(selected);
  setForm({ ...form, payment_mode: upiMap[selected] });
}}


            >
              {/* Google Pay */}
              <Card sx={radioCard}>
                <FormControlLabel value="googlepay" control={<Radio />} label="Google Pay" />
                
              </Card>

              {/* Paytm */}
              <Card sx={radioCard}>
                <FormControlLabel value="paytm" control={<Radio />} label="Paytm" />
                
              </Card>

              {/* Add New UPI */}
              <Card sx={radioCard}>
                <FormControlLabel value="newupi" control={<Radio />} label="Add New UPI ID" />
              </Card>
            </RadioGroup>

            <Button fullWidth variant="contained" sx={payBtn}>
              Pay ₹{amount}
            </Button>
          </AccordionDetails>
        </Accordion>

        {/* CARD PAYMENT */}
        <Accordion expanded={expanded === "card"} onChange={handleAccordion("card")} sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">Credit / Debit Card</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <TextField
              fullWidth
              label="Card Number"
              placeholder="XXXX XXXX XXXX XXXX"
              sx={{ mb: 2 }}
              value={card.number}
              onChange={(e) => setCard({ ...card, number: e.target.value })}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Expiry (MM/YY)"
                value={card.expiry}
                onChange={(e) => setCard({ ...card, expiry: e.target.value })}
              />

              <TextField
                fullWidth
                label="CVV"
                type="password"
                value={card.cvv}
                onChange={(e) => setCard({ ...card, cvv: e.target.value })}
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              sx={payBtn}
              onClick={() => setForm({ ...form, payment_mode: "card" })}
            >
              Pay ₹{amount}
            </Button>
          </AccordionDetails>
        </Accordion>

        {/* ORDER STATUS */}
        <h3 style={sectionTitle}>Order Status</h3>
        <div style={fieldBox}>
          <select name="order_status" value={form.order_status} onChange={handleChange} style={input}>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* ADDRESSES */}
        <h3 style={sectionTitle}>Address Information</h3>

        <div style={fieldBox}>
          <label style={label}>Billing Address</label>
          <textarea name="billing_address" value={form.billing_address} onChange={handleChange} style={textarea} />
        </div>

        <div style={fieldBox}>
          <label style={label}>Shipping Address</label>
          <textarea name="shipping_address" value={form.shipping_address} onChange={handleChange} style={textarea} />
        </div>

        {/* SHOW SELECTED PAYMENT MODE */}
        <p><b>Selected Payment Mode:</b> {form.payment_mode || "None selected"}</p>

        {/* SUBMIT */}
        <button type="submit" style={submitBtn}>Submit Order</button>

      </form>
    </div>
  );
}

/* Styles */
const pageContainer = { maxWidth: "650px", margin: "auto", padding: "20px" };
const title = { textAlign: "center", marginBottom: "20px" };
const formCard = { padding: "20px", background: "white", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" };
const sectionTitle = { marginTop: "20px", marginBottom: "10px" };
const fieldBox = { marginBottom: "15px" };
const label = { display: "block", marginBottom: "5px" };
const input = { width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc" };
const readOnlyInput = { ...input, background: "#f5f5f5", fontWeight: "bold" };
const textarea = { ...input, height: "80px" };
const radioCard = { p: 1, mb: 1, display: "flex", alignItems: "center" };
const payBtn = { bgcolor: "#ffcd00", color: "black", fontWeight: "bold", mt: 2 };
const submitBtn = { width: "100%", padding: "12px", background: "#4caf50", color: "#fff", borderRadius: "8px", marginTop: "20px" };

export default Order;