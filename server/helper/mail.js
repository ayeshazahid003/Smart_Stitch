// helper/mail.js
import nodemailer from "nodemailer";

// MailHog SMTP configuration for local testing
const smtpConfig = {
  host: "localhost", // MailHog server address
  port: 1025, // MailHog SMTP port
  secure: false, // No TLS needed for MailHog
};

// Create a transporter object
const transporter = nodemailer.createTransport(smtpConfig);

export const sendEmail = async (senderEmail, receiverEmail, subject, body) => {
  try {
    // Create the email options
    const mailOptions = {
      from: senderEmail,
      to: receiverEmail,
      subject: subject,
      text: body,
      html: body, // Optional: Include HTML version of the email
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent to MailHog:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email to MailHog:", error);
    throw error;
  }
};
