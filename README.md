// server.js
// GeoTerraChainQFS Backend — Pi Network Payment Approval & Completion

const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Pi Network API
const PI_API_URL = "https://api.minepi.com/v2";
const PI_API_KEY = process.env.PI_API_KEY;

// Route principale
app.get("/", (req, res) => {
  res.json({
    app: "GeoTerraChainQFS Backend",
    status: "running",
  });
});

// Création d'un paiement Pi
app.post("/create-payment", async (req, res) => {
  const { amount, memo, metadata } = req.body;

  try {
    const response = await axios.post(
      `${PI_API_URL}/payments`,
      {
        amount: amount,
        memo: memo || "GeoTerraChainQFS Payment",
        metadata: metadata || {},
      },
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Payment creation failed",
      details: error.message,
    });
  }
});

// Approve payment
app.post("/approve-payment", async (req, res) => {
  const { paymentId } = req.body;

  try {
    const response = await axios.post(
      `${PI_API_URL}/payments/${paymentId}/approve`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Payment approval failed",
      details: error.message,
    });
  }
});

// Complete payment
app.post("/complete-payment", async (req, res) => {
  const { paymentId } = req.body;

  try {
    const response = await axios.post(
      `${PI_API_URL}/payments/${paymentId}/complete`,
      {},
      {
        headers: {
          Authorization: `Key ${PI_API_KEY}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Payment completion failed",
      details: error.message,
    });
  }
});

// Webhook Pi
app.post("/webhook", (req, res) => {
  console.log("Webhook received:", req.body);
  res.status(200).send("Webhook received");
});

app.listen(PORT, () => {
  console.log(`GeoTerraChainQFS Backend running on port ${PORT}`);
});
