import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true 
  },
  password: { 
    type: String,
    select: false // Only returned when explicitly requested
  },
  picture: { 
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  },
  role: { 
    type: String, 
    enum: ["user", "admin"], 
    default: "user" 
  },
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true 
  }
}, { 
  timestamps: true 
});

/**
 * ✅ FIXED: Modern Async Middleware
 * In modern Mongoose, if you use an async function, 
 * you do NOT need the 'next' parameter.
 */
userSchema.pre("save", async function () {
  // 1. Only hash if the password field is being modified (or is new)
  if (!this.isModified("password") || !this.password) {
    return; // Simply return to finish the hook
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    // If an error occurs, throwing it will stop the save process
    throw error; 
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  // Ensure password field exists (it won't if .select('+password') wasn't used)
  if (!this.password) {
    console.error("Auth Error: comparePassword called on user object without password field.");
    return false;
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;