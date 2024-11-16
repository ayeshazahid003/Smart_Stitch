import User from "../models/UserSchema.js";

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from route parameters
    const { name, email, password, role, contactInfo } = req.body; // Extract fields from request body

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update only allowed fields
    const updatedData = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password) updatedData.password = password; // Note: Hash the password if you allow updating it
    if (role) updatedData.role = role;
    if (contactInfo) updatedData.contactInfo = contactInfo;

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated user
      runValidators: true, // Ensure validation rules are applied
    });

    res.status(200).json({
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from route parameters

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete the user from the database
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User account deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
