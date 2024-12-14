import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../helper/generateToken.js";

export const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Validate the required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name:username,
      email,
      password: hashedPassword,
      role,
    });

    // Save the user to the database
    const user = await newUser.save();

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
