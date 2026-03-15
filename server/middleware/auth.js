import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  // 1. Get the token from the request header safely
  const authHeader = req.headers.authorization;

  // Check if header exists and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false, 
      message: "Access denied. Please login to continue." 
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Attach the user data to the request
    // We ensure the ID is easily accessible as req.user._id
    req.user = decoded;
    
    // Small logic fix: standardizing the ID field 
    // If your JWT uses 'id', we map it to '_id' for MongoDB consistency
    if (decoded.id && !decoded._id) {
      req.user._id = decoded.id;
    }
    
    next(); 
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    
    // Distinguish between expired and just "bad" tokens
    const message = error.name === "TokenExpiredError" 
      ? "Session expired. Please login again." 
      : "Invalid token. Access denied.";

    res.status(403).json({ 
      success: false, 
      message 
    });
  }
};