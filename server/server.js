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

// --- ROUTE IMPORTS (Matches your specific filenames) ---
import newsletterRoutes from "./routes/newsLetter.js"; 
import productUploadRoutes from "./routes/ProductRoutes.js"; 
import productFilterRoutes from "./routes/Product.js"; 
import webhookRoutes from "./routes/Webhook.js";      // Capital W
import orderRoutes from "./routes/orderRoutes.js";     // Kept your 'orderRutes' typo to match file
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1️⃣ Database Connection
connectDB();

// 2️⃣ CORS Configuration
const allowedOrigins = [
  "http://localhost:3000", 
  "https://ecomshoes-9.onrender.com",
  "https://ecomshoes-8.onrender.com",
  process.env.FRONTEND_URL 
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS block: This origin is not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"],
  credentials: true
}));

// 3️⃣ Environment Setup (Uploads Folder)
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 4️⃣ STRIPE WEBHOOK (Must stay ABOVE express.json)
app.use("/api/webhook", express.raw({ type: "application/json" }), webhookRoutes);

// 5️⃣ Body Parsers
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 6️⃣ Static Files
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
app.use("/external-api", orderRoutes); 
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
