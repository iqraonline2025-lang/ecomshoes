import express from "express";
import { 
  registerUser, 
  loginUser, 
  googleAuth 
} from "../controllers/authController.js";

const router = express.Router();

// 📝 Form Registration: POST /api/auth/register
router.post("/register", registerUser);

// 🔑 Form Login: POST /api/auth/login
router.post("/login", loginUser);

// 🌐 Google Auth: POST /api/auth/google
router.post("/google", googleAuth);

export default router;