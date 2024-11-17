import User from "../models/User.js";
import { uploadSingleFile } from '../helper/cloudinaryUploader.js';

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, contactInfo } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (contactInfo) user.contactInfo = contactInfo;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "User account deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error. Please try again later." });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ success: false, message: 'Internal server error.', error });
  }
};

export const uploadProfilePicture = async (req, res) => {
  try {
    const { filePath } = req.body;
    const { id } = req.params;

    const uploadedImage = await uploadSingleFile(filePath, 'Home');

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.profilePicture = uploadedImage.secure_url;

    await user.save();

    res.status(200).json({ success: true, message: 'Profile picture updated.', user });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ success: false, message: 'Internal server error.', error });
  }
};

export const addMeasurements = async (req, res) => {
  try {
    const { id } = req.params;
    const measurements = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.measurements) {
      return res.status(400).json({ success: false, message: "Measurements already exist. Use the update endpoint to modify them." });
    }

    user.measurements = measurements;
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Measurements added successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error. Please try again later.", error });
  }
};

export const updateMeasurements = async (req, res) => {
  try {
    const { id } = req.params;
    const measurements = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (!user.measurements) {
      return res.status(400).json({ success: false, message: "No existing measurements found. Use the add endpoint to create them." });
    }

    Object.assign(user.measurements, measurements);
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Measurements updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error. Please try again later.", error });
  }
};
