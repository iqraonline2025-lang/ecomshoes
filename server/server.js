// 1. MUST BE LINE 1: Load environment variables before ANY other imports
import 'dotenv/config'; 

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

// --- ROUTE IMPORTS ---
import newsletterRoutes from "./routes/newsLetter.js"; 
import productUploadRoutes from "./routes/ProductRoutes.js"; 
import productFilterRoutes from "./routes/Product.js"; 
import webhookRoutes from "./routes/Webhook.js";      
import orderRoutes from "./routes/orderRoutes.js";     
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// 1️⃣ Database Connection
connectDB();

// 2️⃣ CORS Configuration
const allowedOrigins = [
  "http://localhost:3000", 
  "https://ecomshoes-vn8j.vercel.app",
  "https://ecomshoes-vn8j.vercel.app"
  process.env.FRONTEND_URL 
].filter(Boolean);

app.use(cors({
  origin: true, // you can later replace with allowedOrigins
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"]
}));

// 3️⃣ Request Logger
app.use((req, res, next) => {
  console.log(`🚀 ${req.method} request to: ${req.url}`);
  next();
});

// 4️⃣ Environment Setup (Uploads Folder)
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 5️⃣ STRIPE WEBHOOK
app.use("/api/webhook", express.raw({ type: "application/json" }), webhookRoutes);
app.use("/api/users", userRoutes);

// 6️⃣ Body Parsers
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// 7️⃣ Static Files
app.use("/uploads", express.static(uploadDir));

// 8️⃣ API Routes

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
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        picture: user.picture, 
        role: user.role 
      },
      token: sessionToken,
    });

  } catch (error) {
    res.status(401).json({ success: false, message: "Authentication failed" });
  }
});

// --- ROUTES ---
app.use("/api/orders", orderRoutes);
app.use("/api/admin", protect, adminRoutes); 
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/auth", authRoutes);

// ✅ Upload + Product Routes
app.use("/api/products", productUploadRoutes); 
app.use("/api/products", productFilterRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "✅ ROADKICKS API is Online" });
});

// 9️⃣ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err.message);
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
  ******************************************
  ✅ Server live at http://localhost:${PORT}
  ******************************************
  `);
});
