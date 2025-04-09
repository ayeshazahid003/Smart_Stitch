// helper/testEmail.js
import { sendEmail } from "./mail.js";

// Test email parameters
const testEmail = async () => {
  try {
    const senderEmail = "noreply@smartstitch.com";
    const receiverEmail = "najmulhassan721@gmail.com";
    const subject = "Welcome to Smart Stitch";
    const body = `
      <h1>Welcome to Smart Stitch!</h1>
      <p>Thank you for signing up with Smart Stitch.</p>
      <p>This is a test email sent through MailHog for local development.</p>
      <p>You can view and manage your account at any time by visiting our website.</p>
      <br>
      <p>Best regards,</p>
      <p>The Smart Stitch Team</p>
    `;

    const result = await sendEmail(senderEmail, receiverEmail, subject, body);
    console.log("Test completed successfully:", result);
  } catch (error) {
    console.error("Test failed:", error);
  }
};

// Run the test
testEmail();
