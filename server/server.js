import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { OAuth2Client } from "google-auth-library"; 
import jwt from "jsonwebtoken"; 
import connectDB from "./config/db.js";

// Models & Middleware
import User from "./models/User.js";
import { protect } from "./middleware/auth.js"; 

// Route imports
import newsletterRoutes from "./routes/newsletter.js";
import productUploadRoutes from "./routes/ProductRoutes.js";
import productFilterRoutes from "./routes/product.js";
import webhookRoutes from "./routes/webhook.js";
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1️⃣ Database Connection
connectDB();

// 2️⃣ CORS Configuration
// SIMPLE EXPLANATION: This list tells the server who is allowed to talk to it.
const allowedOrigins = [
  "http://localhost:3000", 
  process.env.FRONTEND_URL // Add your Vercel/Netlify URL to .env later
];

app.use(cors({
  origin: (origin, callback) => {
    // If there is no origin (like a mobile app) or it's in our list, allow it
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS block: This website is not allowed to access the API"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"],
  credentials: true
}));

// 3️⃣ Environment Setup (Uploads Folder)
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 4️⃣ STRIPE WEBHOOK (CRITICAL: Must stay ABOVE express.json)
// We use express.raw because Stripe needs the "untouched" data to verify the payment signature.
app.use("/api/webhook", express.raw({ type: "application/json" }), webhookRoutes);

// 5️⃣ Body Parsers (For all other normal routes)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 6️⃣ Static Files (So you can view uploaded product images)
app.use("/uploads", express.static(uploadDir));

// 7️⃣ API Routes

// Google Auth Logic
app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, picture, sub } = ticket.getPayload();

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ 
        name, 
        email, 
        picture, 
        googleId: sub 
      });
      await user.save();
    }

    const sessionToken = jwt.sign(
      { id: user._id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      user: { id: user._id, name: user.name, email: user.email, picture: user.picture, role: user.role },
      token: sessionToken,
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
});

// Route Mounting
app.use("/api/orders", orderRoutes);
app.use("/external-api", orderRoutes); // Compatibility fallback
app.use("/api/admin", protect, adminRoutes); 
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/products", productFilterRoutes);
app.use("/api/products", productUploadRoutes);
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ ROADKICKS API running" });
});

// 8️⃣ Global Error Handling
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({ 
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server live at http://localhost:${PORT}`);
});