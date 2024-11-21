import Agenda from "agenda";
import nodemailer from "nodemailer";
import SendEmail from "../model/email.Model.js";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize Agenda with MongoDB connection settings
const agenda = new Agenda({
  db: {
    address: "mongodb+srv://vinit1222003:root@cluster0.v4xuz.mongodb.net/emailService", // Database URL
    collection: "agendaJobs", // Collection to store scheduled jobs
  },
});

// Setup Nodemailer transporter for sending emails using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail", // Gmail as the email service
  auth: {
    user: process.env.EMAIL, // Email address from environment variables
    pass: process.env.EMAILPASSWORD, // Email password from environment variables
  },
});

// Debugging: Log email credentials to ensure they are being loaded correctly
console.log(process.env.EMAIL, process.env.EMAILPASSWORD);

// Agenda Job Definition: This job sends an email when triggered
agenda.define("send email", async (job) => {
  const { emailId } = job.attrs.data; // Extract the emailId from the job data

  try {
    // Fetch the email data from the database using the emailId
    const emailData = await SendEmail.findById(emailId);

    // If email data exists and has not been sent yet, proceed to send the email
    if (emailData && !emailData.sent) {
      const mailOptions = {
        from: process.env.EMAIL, // Sender's email address
        to: emailData.selectedLists, // List of recipient email addresses (assuming selectedLists contains emails)
        subject: emailData.emailSubject, // Subject of the email
        text: emailData.body, // Body content of the email
      };

      // Send the email using Nodemailer
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);

      // Mark the email as sent and save the updated email data
      emailData.sent = true;
      await emailData.save();
    }
  } catch (error) {
    // Log any errors that occur during the email sending process
    console.error("Error in sending email:", error);
  }
});

// Start the Agenda job scheduler
agenda.start();

// Export Agenda instance for use in other parts of the application
export { agenda };
