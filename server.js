// server.js
// GeoTerraChainQFS Backend — Pi Network Payment Approval & Completion
// Node.js + Express.js + Axios for Pi Network API integration

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// === Configuration ===
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Pi Network API configuration (Testnet)
const PI_API_URL = "https://api.minepi.com/v2/payments";
const PI_API_KEY = process.env.PI_API_KEY || "VOTRE_CLE_API_PI";

// === Routes ===

// Route principale
app.get("/", (req, res) => {
  res.json({
    status: "GeoTerraChainQFS Backend",
    message: "Server is running ✅",
  });
});

// Route pour vérifier le solde Pi d'un utilisateur
app.post("/check-balance", async (req, res) => {
  const { piUsername } = req.body;

  if (!piUsername) return res.status(400).json({ error: "Username missing" });

  try {
    const response = await axios.get(`${PI_API_URL}/balance/${piUsername}`, {
      headers: { Authorization: `Bearer ${PI_API_KEY}` },
    });
    res.json({ username: piUsername, balance: response.data.balance });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch balance", details: error.message });
  }
});

// Route pour enregistrer un paiement Pi
app.post("/create-payment", async (req, res) => {
  const { amount, recipientUsername, note } = req.body;

  if (!amount || !recipientUsername)
    return res.status(400).json({ error: "Amount or recipient missing" });

  try {
    const response = await axios.post(
      `${PI_API_URL}/create`,
      {
        amount,
        recipient_username: recipientUsername,
        note: note || "Payment via GeoTerraChainQFS",
      },
      { headers: { Authorization: `Bearer ${PI_API_KEY}` } }
    );
    res.json({ status: "Payment created", payment: response.data });
  } catch (error) {
    res.status(500).json({ error: "Failed to create payment", details: error.message });
  }
});

// Route webhook pour recevoir confirmation de paiement
app.post("/webhook", async (req, res) => {
  const paymentData = req.body;
  console.log("Payment webhook received:", paymentData);
  // Ici, tu peux ajouter ton traitement dans la base de données
  res.json({ status: "Webhook received" });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`GeoTerraChainQFS Backend running on port ${PORT} ✅`);
});
