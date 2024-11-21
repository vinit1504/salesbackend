import jwt from "jsonwebtoken";

// Middleware function to verify the JWT token
export const verifyJwtToken = (req, res, next) => {
  try {
    // Retrieve the token from cookies
    const token = req.cookies.token;

    // If no token is found, return a 403 Forbidden response
    if (!token) {
      return res.status(403).json({
        message: "No token provided. Please login again.", // Inform the user that they need to login again
        success: false,
        flag: 0,
      });
    }

    // Verify the token using the secret key from the environment variable
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      // If the token is invalid or expired, return a 401 Unauthorized response
      if (err) {
        return res.status(401).json({
          message: "Invalid or expired token.", // Inform the user that the token is no longer valid
          success: false,
          flag: 0,
        });
      }

      // If the token is valid, store the decoded user data in the request object
      req.user = decoded;

      // Pass control to the next middleware or route handler
      next();
    });
  } catch (error) {
    // Catch any errors and log them to the console
    console.error("Error in verifyJwtToken:", error);
    
    // Return a 500 Internal Server Error response if something goes wrong
    res.status(500).json({
      message: "Server error while verifying the token.", // Inform the user that there was a server error
      success: false,
      flag: 0,
    });
  }
};
