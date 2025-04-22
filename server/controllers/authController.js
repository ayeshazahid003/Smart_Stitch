import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../helper/generateToken.js";
import { sendEmail } from "../helper/mail.js";

export const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Validate role
    const validRoles = ["customer", "tailor", "platformAdmin"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role selected." });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Base user data
    const newUserData = {
      name: username,
      email,
      password: hashedPassword,
      role,
    };

    // If role is tailor, add tailor-specific fields
    if (role === "tailor") {
      newUserData.tailorProfile = {
        businessName: "",
        services: [],
        portfolio: [],
        verified: false,
      };
    }

    // Create a new user
    const newUser = new User(newUserData);

    // Save the user to the database
    const user = await newUser.save();

    // Generate a JWT token
    generateToken(res, user._id);

    const userProfile = {
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      contactInfo: user.contactInfo,
      address: user.contactInfo?.address || "",
      measurements: user.measurements,
      tailorProfile: user.tailorProfile || null,
      _id: user._id,
    };

    res.status(200).json({
      message: "User created successfully.",
      user: userProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate the required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a JWT token that does not expire
    generateToken(res, user._id);

    const userProfile = {
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      contactInfo: user.contactInfo,
      address: user.contactInfo.address,
      measurements: user.measurements,
      _id: user._id,
    };

    res.status(200).json({
      message: "Login successful.",
      user: userProfile,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const verifyToken = async (req, res) => {
  try {
    // `req.user` is populated by the verifyUser middleware
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Token not valid." });
    }

    res.status(200).json({
      message: "Token is valid.",
      user: req.user, // Contains `id` and `role` attached by middleware
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to user
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send email with OTP
    const emailBody = `
      <h1>Password Reset Request</h1>
      <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail(
      "noreply@smartstitch.com",
      email,
      "Password Reset OTP",
      emailBody
    );

    res.status(200).json({
      message: "OTP has been sent to your email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Save reset token
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({
      message: "OTP verified successfully",
      resetToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      return res
        .status(400)
        .json({ message: "Reset token and new password are required" });
    }

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    console.log("user when reseting", user);
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save new OTP
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Send email with new OTP
    const emailBody = `
      <h1>New OTP for Password Reset</h1>
      <p>Your new OTP is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail(
      "noreply@smartstitch.com",
      email,
      "New Password Reset OTP",
      emailBody
    );

    res.status(200).json({
      message: "New OTP has been sent to your email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
