import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()
// Function to connect to the MongoDB database
export const DataBaseConnect = async () => {
  console.log("Connecting to the database" , process.env.MONGO_URI);
  
  try {
    // Attempt to connect to the MongoDB using the URI from the environment variables
    await mongoose.connect(process.env.MONGO_URI);
    
    // Log a success message if the connection is established
    console.log("Database connection successful");
  } catch (error) {
    // Log an error message if the connection fails
    console.log("Database connection failed");
    
    // Exit the process with a failure code if the connection can't be established
    process.exit(1);
  }
};
