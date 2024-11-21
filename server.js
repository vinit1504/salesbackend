import express from "express"; // Importing Express.js
import dotenv from "dotenv"; // Importing dotenv to load environment variables
import cookieParser from "cookie-parser"; // Importing cookie-parser to handle cookies
import cors from "cors"; // Importing CORS for enabling cross-origin requests
import { DataBaseConnect } from "./database/dataBaseConnection.js"; // Importing database connection function
import sequenceRoutes from "./routes/sequence/sequence.Routes.js"; // Importing routes related to email sequence
import authRoutes from "./routes/auth/auth.Routes.js"; // Importing authentication-related routes

dotenv.config(); // Load environment variables from the .env file
DataBaseConnect(); // Connect to the database

const app = express(); // Creating an Express application

const PORT = process.env.PORT || 8000; // Setting the port from environment variable or default to 8000

// CORS Configuration
const corsOptions = {
  origin: "https://salesfrontend-eight.vercel.app", // Allowing requests only from this frontend origin
  credentials: true, // Allowing cookies to be sent along with the request
  methods: "GET,POST,PUT,DELETE", // Enabling specific HTTP methods
};

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies from requests
app.use(express.urlencoded({ extended: true })); // Middleware to parse URL-encoded request bodies
app.use(cors(corsOptions)); // Enabling CORS with the defined options

// Routes
app.use("/api/v1/email", sequenceRoutes); // API route for handling email-related functionality
app.use("/api/v1/auth", authRoutes); // API route for authentication functionality

// Start the server and listen on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); // Log a message when the server is running
});
