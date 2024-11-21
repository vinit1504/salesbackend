import mongoose from "mongoose";

const sendEmailSchema = new mongoose.Schema(
  {
    time: {
      type: Date,
      required: true,
    },
    emailSubject: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    selectedLists: {
      type: String, // Adjust type if multiple recipients (use Array)
      required: true,
    },
    sent: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SendEmail = mongoose.model("SendEmail", sendEmailSchema);

export default SendEmail;
