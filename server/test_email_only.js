// test_email_only.js
import { sendEmail } from "./helper/mail.js";
import { sendNotification } from "./helper/notificationHelper.js";

// Test email functionality without database
const testEmailOnly = async () => {
  try {
    console.log("🧪 Testing email system...\n");

    // Test customer email
    console.log("📧 Testing customer email...");
    const customerEmailBody = `
      <h1>Test Refund Request Email - Smart Stitch</h1>
      <p>Dear Test Customer,</p>
      <p>This is a test email to verify the refund notification system is working.</p>
      <p><strong>Test ID:</strong> TEST123</p>
      <p><strong>Status:</strong> Testing</p>
      <p><strong>Amount:</strong> $99.99</p>
      <p>If you receive this email, the notification system is working correctly.</p>
      <p>Best regards,<br>Smart Stitch Team</p>
    `;

    try {
      await sendEmail(
        "noreply@smartstitch.com",
        "najmulhassan721@gmail.com", // Use the test email from your config
        "Test Refund Notification - Smart Stitch",
        customerEmailBody
      );
      console.log("✅ Customer email sent successfully to MailHog");
    } catch (error) {
      console.error("❌ Customer email failed:", error.message);
      console.error("Full error:", error);
    }

    // Test tailor email
    console.log("\n📧 Testing tailor email...");
    const tailorEmailBody = `
      <h1>Test Tailor Refund Notification - Smart Stitch</h1>
      <p>Dear Test Tailor,</p>
      <p>This is a test email to verify the tailor refund notification system is working.</p>
      <p><strong>Test Order ID:</strong> TEST123</p>
      <p><strong>Customer:</strong> Test Customer</p>
      <p><strong>Status:</strong> Testing</p>
      <p><strong>Amount:</strong> $99.99</p>
      <p>If you receive this email, the tailor notification system is working correctly.</p>
      <p>Best regards,<br>Smart Stitch Team</p>
    `;

    try {
      await sendEmail(
        "noreply@smartstitch.com",
        "tailor.test@example.com", // Test tailor email
        "Test Tailor Refund Notification - Smart Stitch",
        tailorEmailBody
      );
      console.log("✅ Tailor email sent successfully to MailHog");
    } catch (error) {
      console.error("❌ Tailor email failed:", error.message);
      console.error("Full error:", error);
    }

    console.log("\n🎉 Email test completed!");
    console.log("📍 Check MailHog at http://localhost:8025 to see the test emails");

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
};

// Run the test
testEmailOnly();
