import nodemailer from "nodemailer";

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


export const sendEmail = async (senderEmail, receiverEmail, subject, body) => {
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
