import TrendingDesign from "../models/TrendingDesign.js";
import { uploadSingleFile } from "../helper/cloudinaryUploader.js";

// Add a new trending design
export const addTrendingDesign = async (req, res) => {
  try {
    const { title, description, image, popularityScore = 0 } = req.body;

    // Upload image to Cloudinary if provided
    let designImage = [];
    if (image) {
      const uploadResult = await uploadSingleFile(image, "TrendingDesigns");
      designImage.push(uploadResult.secure_url);
    }

    const newDesign = new TrendingDesign({
      designImage,
      description,
      popularityScore: popularityScore || 0, // Default to 0 if not provided
    });

    const savedDesign = await newDesign.save();
    res.status(201).json(savedDesign);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to add trending design", error: error.message });
  }
};

// Get all trending designs
export const getAllTrendingDesigns = async (req, res) => {
  try {
    const designs = await TrendingDesign.find();
    res.status(200).json(designs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trending designs" });
  }
};

// Get a single trending design by ID
export const getSingleTrendingDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const design = await TrendingDesign.findById(id);

    if (!design) {
      return res.status(404).json({ message: "Trending design not found" });
    }

    res.status(200).json(design);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch trending design" });
  }
};

// Update a trending design by ID
export const updateTrendingDesign = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, popularityScore } = req.body;

    // Prepare update data
    const updateData = {};
    if (description) updateData.description = description;
    if (popularityScore !== undefined)
      updateData.popularityScore = popularityScore;

    // Handle image upload if a new image is provided
    if (image) {
      const uploadResult = await uploadSingleFile(image, "TrendingDesigns");
      updateData.designImage = [uploadResult.secure_url];
    }

    const updatedDesign = await TrendingDesign.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedDesign) {
      return res.status(404).json({ message: "Trending design not found" });
    }

    res.status(200).json(updatedDesign);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update trending design",
      error: error.message,
    });
  }
};

// Delete a trending design by ID
export const deleteTrendingDesign = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDesign = await TrendingDesign.findByIdAndDelete(id);

    if (!deletedDesign) {
      return res.status(404).json({ message: "Trending design not found" });
    }

    res.status(200).json({ message: "Trending design deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete trending design" });
  }
};
