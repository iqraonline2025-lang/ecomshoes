import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  // 1. Log the incoming request to the terminal for debugging
  console.log("--- Auth Middleware Triggered ---");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("❌ No Bearer Token found in headers");
    return res.status(401).json({ 
      success: false, 
      message: "Access denied. Please login to continue." 
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify the token
    // Ensure process.env.JWT_SECRET is defined in your backend .env
    if (!process.env.JWT_SECRET) {
      console.error("❌ CRITICAL: JWT_SECRET is not defined in backend .env");
      return res.status(500).json({ message: "Internal Server Configuration Error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach the user data to a NEW object
    // We use the spread operator {...} to make the object editable
    req.user = { ...decoded };
    
    // Standardizing the ID field 
    // If your login logic used 'id', we map it to '_id' for the controller
    if (decoded.id && !decoded._id) {
      req.user._id = decoded.id;
    }

    console.log("✅ Token Verified for User ID:", req.user._id);
    
    next(); 
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    
    const status = error.name === "TokenExpiredError" ? 401 : 403;
    const message = error.name === "TokenExpiredError" 
      ? "Session expired. Please login again." 
      : "Invalid token. Access denied.";

    res.status(status).json({ 
      success: false, 
      message 
    });
  }
};