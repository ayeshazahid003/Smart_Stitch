// Test welcome email for all user roles
import { sendEmail } from "../helper/mail.js";

const testWelcomeEmailAllRoles = async () => {
  const roles = ["customer", "tailor", "platformAdmin"];

  for (const role of roles) {
    try {
      console.log(`Testing welcome email for ${role}...`);

      const testUser = {
        name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
        email: `test.${role}@example.com`,
        role: role,
      };

      const welcomeEmailBody = `
        <h1>Welcome to Smart Stitch!</h1>
        <p>Dear ${testUser.name},</p>
        <p>Thank you for joining Smart Stitch! We're excited to have you as part of our community.</p>
        
        ${
          role === "customer"
            ? `
          <h2>As a Customer, you can:</h2>
          <ul>
            <li>Browse through our talented tailors</li>
            <li>Place custom orders with detailed measurements</li>
            <li>Track your order progress in real-time</li>
            <li>Rate and review your tailoring experience</li>
          </ul>
        `
            : role === "tailor"
            ? `
          <h2>As a Tailor, you can:</h2>
          <ul>
            <li>Create your professional profile and showcase your work</li>
            <li>Receive custom orders from customers</li>
            <li>Manage your services and pricing</li>
            <li>Build your reputation through customer reviews</li>
          </ul>
          <p><strong>Next Steps:</strong> Please complete your tailor profile to start receiving orders!</p>
        `
            : `
          <h2>Welcome, Platform Administrator!</h2>
          <p>You now have access to manage the Smart Stitch platform.</p>
        `
        }
        
        <p>To get started, please log in to your account and explore all the features we have to offer.</p>
        
        <p>If you have any questions or need assistance, our support team is here to help.</p>
        
        <p>Welcome aboard!</p>
        <p>Best regards,<br>The Smart Stitch Team</p>
      `;

      const result = await sendEmail(
        "noreply@smartstitch.com",
        testUser.email,
        "Welcome to Smart Stitch - Let's Get Started!",
        welcomeEmailBody
      );

      console.log(`✅ ${role} welcome email sent successfully`);
    } catch (error) {
      console.error(`❌ Error sending ${role} welcome email:`, error);
    }
  }

  console.log("All welcome email tests completed!");
};

testWelcomeEmailAllRoles();
