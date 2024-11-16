const nodemailer = require("nodemailer");

// SMTP configuration
const smtpConfig = {
  host: process.env.host_SECRET,
  port: 527, // Use 587 for TLS or 465 for SSL
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER_SECRET,
    pass: process.env.MAIL_PASSWORD_SECRET,
  },
};

// Create a transporter object
const transporter = nodemailer.createTransport(smtpConfig);

/**
 * Function to send an email using Amazon SES SMTP
 * @param {string} senderEmail - The email address of the sender.
 * @param {string} receiverEmail - The email address of the recipient.
 * @param {string} subject - The subject of the email.
 * @param {string} body - The body of the email (text content).
 * @returns {Promise} - A promise that resolves when the email is sent.
 */
const sendEmail = async (senderEmail, receiverEmail, subject, body) => {
  try {
    // Create the email options
    const mailOptions = {
      from: senderEmail,
      to: receiverEmail,
      subject: subject,
      text: body,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully: " + info.response);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
