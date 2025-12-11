import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Card,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LockIcon from "@mui/icons-material/Lock";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

// --- Theme Colors for a Boutique Look ---
const BOUTIQUE_PRIMARY = "#795548"; // Subtle Brown/Sepia
const ACCENT_GOLD = "#FFC107"; // Gold for emphasis
const LIGHT_BACKGROUND = "#F5F5F5"; // Light Grey background

function Payment() {
  const location = useLocation();

  // Receive values from Order.jsx
  const orderId = location.state?.orderId || "";
  const amount = location.state?.amount || 0;
  const paymentMode = location.state?.paymentMode || "";

  const [upiApp, setUpiApp] = useState("");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });

  // ⭐ Handle Payment Submission (Simulated)
 const handlePayment = async () => {
  // Validation
  if (paymentMode.startsWith("upi/") && upiApp === "" && paymentMode !== "flipkart_upi") {
    alert("Please select a UPI app.");
    return;
  }

  if (paymentMode === "card" && (!card.number || !card.expiry || !card.cvv)) {
    alert("Please fill all card details.");
    return;
  }

  try {
    const transactionId = "TXN" + orderId + Math.floor(10000 + Math.random() * 90000);

    await axios.post("http://127.0.0.1:8000/api/payments", {
      order_id: orderId,
      transaction_id: transactionId,
      amount: amount,
      payment_mode: upiApp || paymentMode,  // If UPI → use selected UPI app
      payment_status: "success"
    });

    alert("Payment Successful!");

  } catch (error) {
    console.log(error);
    alert("Payment Failed!");
  }
};


  return (
    <Box sx={{ maxWidth: 500, margin: "auto", mt: 4, mb: 6, p: 2 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color={BOUTIQUE_PRIMARY}>
          Secure Checkout
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "success.main" }}>
          <LockIcon fontSize="small" />
          <Typography fontSize="14px" fontWeight="medium">
            100% Secure Payment
          </Typography>
        </Box>
      </Box>

      {/* --- Order Summary Cards --- */}
      <Card
        elevation={3}
        sx={{
          p: 3,
          mb: 3,
          bgcolor: LIGHT_BACKGROUND,
          borderRadius: 2,
        }}
      >
        <Typography fontSize="16px" color="text.secondary" sx={{ mb: 1 }}>
          Order Details
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="body1" fontWeight="medium">
            Order ID: **{orderId}**
          </Typography>
          <Typography fontWeight="bold" variant="h6" color={BOUTIQUE_PRIMARY}>
            ₹{amount}
          </Typography>
        </Box>
      </Card>
      
      <Divider sx={{ mb: 3 }} />

      {/* ⭐ SHOW ONLY THE PAYMENT METHOD SELECTED IN ORDER PAGE ⭐ */}

      {/* ------------------ FLIPKART UPI (Direct Payment) ------------------ */}
      {paymentMode === "flipkart_upi" && (
        <Accordion defaultExpanded elevation={3} sx={{ borderRadius: 2, mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: LIGHT_BACKGROUND }}>
            <PhoneIphoneIcon sx={{ mr: 2, color: BOUTIQUE_PRIMARY }} />
            <Typography fontWeight="bold">Flipkart UPI</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your selected Flipkart UPI ID will be used to process the payment instantly.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{ background: BOUTIQUE_PRIMARY, fontWeight: "bold", py: 1.5, "&:hover": { bgcolor: "#5d4037" } }}
              onClick={handlePayment}
              
            >
              Pay ₹{amount} Now
            </Button>
          </AccordionDetails>
        </Accordion>
      )}

      {/* ------------------ UPI PAYMENT (App Selection) ------------------ */}
      {paymentMode.startsWith("upi/") && (
        <Accordion defaultExpanded elevation={3} sx={{ borderRadius: 2, mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: LIGHT_BACKGROUND }}>
            <PhoneIphoneIcon sx={{ mr: 2, color: BOUTIQUE_PRIMARY }} />
            <Typography fontWeight="bold">Pay with UPI</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Select your preferred app for payment:
            </Typography>
            <RadioGroup
              value={upiApp}
              onChange={(e) => setUpiApp(e.target.value)}
            >
              {/* Google Pay */}
              {paymentMode === "upi/gpay" && (
                <Card sx={{ p: 1.5, mb: 1, display: "flex", alignItems: "center", border: upiApp === "googlepay" ? `2px solid ${ACCENT_GOLD}` : '1px solid #e0e0e0', transition: 'border 0.3s' }}>
                  <FormControlLabel
                    value="googlepay"
                    control={<Radio />}
                    label="Google Pay"
                    sx={{ flexGrow: 1 }}
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/e/e5/Google_Pay_Logo.png"
                    alt="Google Pay"
                    style={{ width: 40 }}
                  />
                </Card>
              )}

              {/* Paytm */}
              {paymentMode === "upi/paytm" && (
                <Card sx={{ p: 1.5, mb: 1, display: "flex", alignItems: "center", border: upiApp === "paytm" ? `2px solid ${ACCENT_GOLD}` : '1px solid #e0e0e0', transition: 'border 0.3s' }}>
                  <FormControlLabel
                    value="paytm"
                    control={<Radio />}
                    label="Paytm"
                    sx={{ flexGrow: 1 }}
                  />
                  <img
                    src="https://i.ibb.co/9471kfz/paytm.png"
                    alt="Paytm"
                    style={{ width: 55 }}
                  />
                </Card>
              )}

              {/* PhonePe */}
              {paymentMode === "upi/phonepe" && (
                <Card sx={{ p: 1.5, mb: 1, display: "flex", alignItems: "center", border: upiApp === "phonepe" ? `2px solid ${ACCENT_GOLD}` : '1px solid #e0e0e0', transition: 'border 0.3s' }}>
                  <FormControlLabel
                    value="phonepe"
                    control={<Radio />}
                    label="PhonePe"
                    sx={{ flexGrow: 1 }}
                  />
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/fc/PhonePe_Logo.png"
                    alt="PhonePe"
                    style={{ width: 40 }}
                  />
                </Card>
              )}

              {/* New UPI ID (Always available if paymentMode starts with upi/) */}
              {paymentMode === "upi/new" && (
                <Card sx={{ p: 1.5, border: upiApp === "newupi" ? `2px solid ${ACCENT_GOLD}` : '1px solid #e0e0e0', transition: 'border 0.3s' }}>
                  <FormControlLabel
                    value="newupi"
                    control={<Radio />}
                    label="Enter a different UPI ID"
                  />
                  {upiApp === "newupi" && (
                      <TextField
                          fullWidth
                          size="small"
                          label="Your UPI VPA"
                          placeholder="example@bank"
                          sx={{ mt: 1 }}
                          required
                      />
                  )}
                </Card>
              )}
            </RadioGroup>

            <Button
              fullWidth
              variant="contained"
              disabled={upiApp === ""}
              sx={{ bgcolor: ACCENT_GOLD, color: "black", fontWeight: "bold", mt: 3, py: 1.5, "&:hover": { bgcolor: '#fbc02d' } }}
              onClick={handlePayment}
            >
              Pay ₹{amount} Securely
            </Button>
          </AccordionDetails>
        </Accordion>
      )}

      {/* ------------------ CARD PAYMENT ------------------ */}
      {paymentMode === "card" && (
        <Accordion defaultExpanded elevation={3} sx={{ borderRadius: 2, mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: LIGHT_BACKGROUND }}>
            <CreditCardIcon sx={{ mr: 2, color: BOUTIQUE_PRIMARY }} />
            <Typography fontWeight="bold">Credit / Debit Card</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <TextField
              fullWidth
              label="Card Number"
              placeholder="XXXX XXXX XXXX XXXX"
              type="text"
              inputProps={{ maxLength: 19 }} // For 16 digits + 3 spaces
              sx={{ mb: 2 }}
              value={card.number}
              onChange={(e) => setCard({ ...card, number: e.target.value })}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                fullWidth
                label="Expiry (MM/YY)"
                placeholder="MM/YY"
                inputProps={{ maxLength: 5 }} // MM/YY
                value={card.expiry}
                onChange={(e) => setCard({ ...card, expiry: e.target.value.replace(/[^0-9/]/g, '').slice(0, 5) })}
              />

              <TextField
                fullWidth
                label="CVV"
                type="password"
                placeholder="***"
                inputProps={{ maxLength: 3 }}
                value={card.cvv}
                onChange={(e) => setCard({ ...card, cvv: e.target.value })}
              />
            </Box>

            <Button
              fullWidth
              variant="contained"
              disabled={card.number.length < 16 || card.expiry.length < 5 || card.cvv.length < 3}
              sx={{ background: BOUTIQUE_PRIMARY, fontWeight: "bold", mt: 3, py: 1.5, "&:hover": { bgcolor: "#5d4037" } }}
              onClick={handlePayment}
            >
              Pay ₹{amount}
            </Button>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Payment Security Footer */}
      <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="caption">
          All transactions are encrypted and processed securely. We never store your card details.
        </Typography>
      </Box>
    </Box>
  );
}

export default Payment;