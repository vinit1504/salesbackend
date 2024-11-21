import SendEmail from "../../model/email.Model.js";
import { agenda } from "../../job/emailJobs.js";

// Controller to handle email creation and scheduling
export const createEmail = async (req, res) => {
  try {
    // Destructure request body to get email details
    const { time, emailSubject, body, selectedLists } = req.body;

    // Create a new email document with provided details
    const newEmail = new SendEmail({
      time,
      emailSubject,
      body,
      selectedLists,
    });

    // Save the email document to the database
    const savedEmail = await newEmail.save();

    // Schedule the email to be sent using Agenda at the specified time
    agenda.schedule(new Date(time), "send email", { emailId: savedEmail._id });

    // Respond with success message and the saved email data
    return res.status(201).json({
      message: "Email scheduled successfully",
      email: savedEmail,
    });
  } catch (error) {
    // Log and respond with an error message if something goes wrong
    console.error("Error scheduling email:", error);
    return res.status(500).json({ message: "Failed to schedule email" });
  }
};
