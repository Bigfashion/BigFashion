// server.js - Backend for Big Fashion Payments

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const axios = require("axios");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "bigfashion-pay";

const configFilePath = path.join(__dirname, "payment-config.json");

function saveConfig(data) {
  fs.writeFileSync(configFilePath, JSON.stringify(data, null, 2));
}

function loadConfig() {
  if (fs.existsSync(configFilePath)) {
    return JSON.parse(fs.readFileSync(configFilePath));
  }
  return {
    paypal: {},
    mpesa: {},
  };
}

// Middleware: Basic Admin Auth
app.use("/admin", (req, res, next) => {
  const password = req.headers["x-admin-password"];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// Admin: Set Payment Configs
app.post("/admin/payments", (req, res) => {
  const config = loadConfig();
  const { paypal, mpesa } = req.body;
  if (paypal) config.paypal = paypal;
  if (mpesa) config.mpesa = mpesa;
  saveConfig(config);
  res.json({ success: true });
});

// Admin: Get Current Payment Configs
app.get("/admin/payments", (req, res) => {
  const config = loadConfig();
  res.json(config);
});

// PayPal: Create Payment (stub, frontend uses SDK)
app.post("/paypal/order", async (req, res) => {
  const { total } = req.body;
  const config = loadConfig();
  const mode = config.paypal.mode || "sandbox";
  const base = mode === "live" ? "https://api.paypal.com" : "https://api-m.sandbox.paypal.com";

  try {
    const tokenRes = await axios.post(
      `${base}/v1/oauth2/token`,
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        auth: {
          username: config.paypal.clientId,
          password: config.paypal.secret,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenRes.data.access_token;
    const order = await axios.post(
      `${base}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: total } }],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(order.data);
  } catch (error) {
    res.status(500).json({ error: "PayPal order creation failed", details: error.message });
  }
});

// M-Pesa: STK Push
app.post("/mpesa/stkpush", async (req, res) => {
  const { phone, amount } = req.body;
  const config = loadConfig();
  const mode = config.mpesa.mode || "sandbox";
  const base = mode === "live" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

  try {
    // Get Access Token
    const tokenRes = await axios.get(`${base}/oauth/v1/generate?grant_type=client_credentials`, {
      auth: {
        username: config.mpesa.consumerKey,
        password: config.mpesa.consumerSecret,
      },
    });
    const token = tokenRes.data.access_token;

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(
      config.mpesa.shortcode + config.mpesa.passkey + timestamp
    ).toString("base64");

    const stkRes = await axios.post(
      `${base}/mpesa/stkpush/v1/processrequest`,
      {
        BusinessShortCode: config.mpesa.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: config.mpesa.shortcode,
        PhoneNumber: phone,
        CallBackURL: "https://yourdomain.com/mpesa/callback",
        AccountReference: "BigFashion",
        TransactionDesc: "Payment to Big Fashion",
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    res.json(stkRes.data);
  } catch (error) {
    res.status(500).json({ error: "STK Push failed", details: error.message });
  }
});

// M-Pesa Callback (Simulated)
app.post("/mpesa/callback", (req, res) => {
  console.log("M-Pesa callback:", req.body);
  res.json({ ResultCode: 0, ResultDesc: "Accepted" });
});

app.listen(PORT, () => {
  console.log(`Big Fashion backend running on http://localhost:${PORT}`);
});
