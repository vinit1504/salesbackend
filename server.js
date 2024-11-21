import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet"; // Added for additional security
import rateLimit from "express-rate-limit"; // Added for rate limiting
import { DataBaseConnect } from "./database/dataBaseConnection.js";
import sequenceRoutes from "./routes/sequence/sequence.Routes.js";
import authRoutes from "./routes/auth/auth.Routes.js";

// Load environment variables
dotenv.config();

// Database Connection
DataBaseConnect();

const app = express();

// Port Configuration
const PORT = process.env.PORT || 8000;

// Rate Limiting Middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in RateLimit-* headers
  legacyHeaders: false, // Disable X-RateLimit-* headers
});

// Comprehensive CORS Configuration
const corsOptions = {
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173', 
      'https://salesfrontend-eight.vercel.app',
      // Add any additional origins here
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With', 
    'Accept', 
    'Origin', 
    'Cache-Control'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(limiter); // Apply rate limiting
app.use(helmet()); // Add security headers
app.use(cors(corsOptions)); // CORS middleware
app.options('*', cors(corsOptions)); // Enable preflight requests for all routes

// Body Parsing Middleware
app.use(express.json({
  limit: '10kb' // Limit payload size
}));
app.use(cookieParser());
app.use(express.urlencoded({ 
  extended: true,
  limit: '10kb' // Limit URL-encoded payload size
}));

// Logging Middleware (optional, for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use("/api/v1/email", sequenceRoutes);
app.use("/api/v1/auth", authRoutes);


// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  });
});

// 404 Handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

// Server Start
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;