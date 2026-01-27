/**
 * BACKEND AUTH MIDDLEWARE - LOGGING TEMPLATE
 * 
 * Add this logging to your backend authentication middleware
 * This file is a TEMPLATE - copy the logging code into your actual middleware
 * 
 * Location: Usually in middleware/auth.js or middleware/verifyToken.js
 */

const jwt = require('jsonwebtoken');

// ============================================
// AUTHENTICATION MIDDLEWARE WITH LOGGING
// ============================================
const authenticateToken = (req, res, next) => {
  // ============================================
  // [BACKEND][AUTH] Request Received
  // ============================================
  console.log("============================================");
  console.log("[BACKEND][AUTH] Authentication middleware triggered");
  console.log("[BACKEND][AUTH] Timestamp:", new Date().toISOString());
  console.log("[BACKEND][AUTH] Request method:", req.method);
  console.log("[BACKEND][AUTH] Request URL:", req.originalUrl || req.url);
  console.log("[BACKEND][AUTH] Request path:", req.path);
  console.log("[BACKEND][AUTH] Request headers keys:", Object.keys(req.headers));
  
  // ============================================
  // [BACKEND][AUTH] Extract Authorization Header
  // ============================================
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  console.log("[BACKEND][AUTH] Authorization header exists:", !!authHeader);
  
  if (authHeader) {
    console.log("[BACKEND][AUTH] Authorization header value:", authHeader);
    console.log("[BACKEND][AUTH] Authorization header length:", authHeader.length);
    console.log("[BACKEND][AUTH] Authorization header starts with 'Bearer':", authHeader.startsWith('Bearer ') || authHeader.startsWith('bearer '));
  } else {
    console.log("[BACKEND][AUTH] ❌ No Authorization header found");
    console.log("[BACKEND][AUTH] All request headers:", JSON.stringify(req.headers, null, 2));
    console.log("============================================");
    return res.status(401).json({ 
      message: "Not authorized, token failed",
      error: "Authorization header missing"
    });
  }
  
  // ============================================
  // [BACKEND][AUTH] Extract Token from Header
  // ============================================
  const token = authHeader.split(' ')[1]; // Get token after "Bearer "
  console.log("[BACKEND][AUTH] Token extracted from header:", !!token);
  console.log("[BACKEND][AUTH] Token length:", token?.length || 0);
  console.log("[BACKEND][AUTH] Token first 20 chars:", token ? token.substring(0, 20) : "null");
  console.log("[BACKEND][AUTH] Token starts with 'eyJ':", token?.startsWith('eyJ') || false);
  console.log("[BACKEND][AUTH] Token format check:", token && token.split('.').length === 3 ? "VALID JWT FORMAT" : "INVALID FORMAT");
  
  if (!token) {
    console.log("[BACKEND][AUTH] ❌ Token not found in Authorization header");
    console.log("[BACKEND][AUTH] Header format:", authHeader);
    console.log("============================================");
    return res.status(401).json({ 
      message: "Not authorized, token failed",
      error: "Token missing from Authorization header"
    });
  }
  
  // ============================================
  // [BACKEND][AUTH] Check JWT_SECRET
  // ============================================
  const jwtSecret = process.env.JWT_SECRET;
  console.log("[BACKEND][AUTH] JWT_SECRET exists:", !!jwtSecret);
  console.log("[BACKEND][AUTH] JWT_SECRET length:", jwtSecret?.length || 0);
  console.log("[BACKEND][AUTH] JWT_SECRET first 10 chars:", jwtSecret ? jwtSecret.substring(0, 10) + "..." : "null");
  
  if (!jwtSecret) {
    console.error("[BACKEND][AUTH] ❌ CRITICAL: JWT_SECRET is not set!");
    console.log("============================================");
    return res.status(500).json({ 
      message: "Server configuration error",
      error: "JWT_SECRET not configured"
    });
  }
  
  // ============================================
  // [BACKEND][AUTH] Decode Token (without verification) to check structure
  // ============================================
  try {
    const decodedWithoutVerify = jwt.decode(token, { complete: true });
    if (decodedWithoutVerify) {
      console.log("[BACKEND][AUTH] Token decoded (without verification) - structure valid");
      console.log("[BACKEND][AUTH] Token header:", JSON.stringify(decodedWithoutVerify.header, null, 2));
      console.log("[BACKEND][AUTH] Token payload preview:", {
        iat: decodedWithoutVerify.payload.iat,
        exp: decodedWithoutVerify.payload.exp,
        id: decodedWithoutVerify.payload.id ? "EXISTS" : "MISSING",
        email: decodedWithoutVerify.payload.email || "MISSING",
        role: decodedWithoutVerify.payload.role || "MISSING"
      });
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      const exp = decodedWithoutVerify.payload.exp;
      const isExpired = exp && now > exp;
      console.log("[BACKEND][AUTH] Token expiration check:");
      console.log("[BACKEND][AUTH] - Current time (unix):", now, new Date(now * 1000).toISOString());
      console.log("[BACKEND][AUTH] - Token expires (unix):", exp, exp ? new Date(exp * 1000).toISOString() : "NO EXP");
      console.log("[BACKEND][AUTH] - Is expired:", isExpired);
      if (isExpired) {
        console.log("[BACKEND][AUTH] ⚠️ Token is EXPIRED");
      }
      
      // Check if token is Google OAuth id_token
      const isGoogleToken = decodedWithoutVerify.payload.iss && 
                           (decodedWithoutVerify.payload.iss.includes('google') || 
                            decodedWithoutVerify.payload.iss.includes('accounts.google'));
      console.log("[BACKEND][AUTH] Token issuer:", decodedWithoutVerify.payload.iss || "unknown");
      console.log("[BACKEND][AUTH] Is Google OAuth token:", isGoogleToken);
      if (isGoogleToken) {
        console.error("[BACKEND][AUTH] ❌ CRITICAL: Token is Google OAuth id_token, not backend JWT!");
        console.log("[BACKEND][AUTH] This token cannot be verified with JWT_SECRET");
      }
    } else {
      console.log("[BACKEND][AUTH] ⚠️ Token decode failed - malformed token");
    }
  } catch (decodeError) {
    console.error("[BACKEND][AUTH] ❌ Error decoding token (without verification):", decodeError.message);
  }
  
  // ============================================
  // [BACKEND][AUTH] Verify Token with JWT_SECRET
  // ============================================
  console.log("[BACKEND][AUTH] Attempting to verify token with JWT_SECRET...");
  
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      // ============================================
      // [BACKEND][AUTH] JWT Verification Failed
      // ============================================
      console.error("[BACKEND][AUTH] ❌ JWT verification FAILED");
      console.error("[BACKEND][AUTH] Error name:", err.name);
      console.error("[BACKEND][AUTH] Error message:", err.message);
      console.error("[BACKEND][AUTH] Full error:", JSON.stringify(err, null, 2));
      
      // Detailed error analysis
      if (err.name === 'TokenExpiredError') {
        console.error("[BACKEND][AUTH] ❌ Token is EXPIRED");
        console.error("[BACKEND][AUTH] Expired at:", new Date(err.expiredAt).toISOString());
      } else if (err.name === 'JsonWebTokenError') {
        console.error("[BACKEND][AUTH] ❌ Token is INVALID/MALFORMED");
        console.error("[BACKEND][AUTH] Possible causes:");
        console.error("[BACKEND][AUTH] - Token was not signed with JWT_SECRET");
        console.error("[BACKEND][AUTH] - Token is corrupted");
        console.error("[BACKEND][AUTH] - Token is Google OAuth token (wrong type)");
      } else if (err.name === 'NotBeforeError') {
        console.error("[BACKEND][AUTH] ❌ Token not active yet");
      }
      
      console.log("============================================");
      return res.status(401).json({ 
        message: "Not authorized, token failed",
        error: err.message,
        errorType: err.name
      });
    }
    
    // ============================================
    // [BACKEND][AUTH] JWT Verification Success
    // ============================================
    console.log("[BACKEND][AUTH] ✅ JWT verification SUCCESS");
    console.log("[BACKEND][AUTH] Decoded token payload:", JSON.stringify(decoded, null, 2));
    console.log("[BACKEND][AUTH] User ID:", decoded.id || decoded._id || "MISSING");
    console.log("[BACKEND][AUTH] User email:", decoded.email || "MISSING");
    console.log("[BACKEND][AUTH] User role:", decoded.role || "MISSING");
    console.log("[BACKEND][AUTH] Token issued at:", decoded.iat ? new Date(decoded.iat * 1000).toISOString() : "MISSING");
    console.log("[BACKEND][AUTH] Token expires at:", decoded.exp ? new Date(decoded.exp * 1000).toISOString() : "MISSING");
    console.log("============================================");
    
    // Attach decoded user info to request
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;

/**
 * USAGE INSTRUCTIONS:
 * 
 * 1. Find your authentication middleware file (usually in middleware/auth.js or routes/middleware.js)
 * 2. Replace or enhance your existing middleware with the logging from this template
 * 3. Ensure JWT_SECRET is set in your Render environment variables
 * 4. Deploy and check Render logs for [BACKEND][AUTH] prefixed messages
 * 
 * VALIDATION CHECKS TO PERFORM:
 * 
 * 1. Check Render Environment Variables:
 *    - Go to Render Dashboard → Your Service → Environment
 *    - Verify JWT_SECRET exists and matches your local .env file
 * 
 * 2. Compare JWT_SECRET values:
 *    - Local: Check your .env file
 *    - Render: Check environment variables in dashboard
 *    - They MUST be identical
 * 
 * 3. Test token format:
 *    - Logs will show if token starts with 'eyJ' (valid JWT)
 *    - Logs will show if token has 3 parts (header.payload.signature)
 * 
 * 4. Check token issuer:
 *    - Logs will detect if token is Google OAuth id_token
 *    - Backend JWT should NOT have Google issuer
 * 
 * 5. Verify token expiration:
 *    - Logs will show if token is expired
 *    - Compare exp timestamp with current time
 */
