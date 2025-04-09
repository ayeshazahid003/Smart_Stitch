import { uploadSingleFile } from "../helper/cloudinaryUploader.js";

export const uploadImage = async (req, res) => {
  try {
    const { file } = req.body;
    console.log("req from upload iamge", req.body);
    console.log("File received:", file);
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadSingleFile(file, "Home");
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      url: result.url,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to upload image",
      error: error.message,
    });
  }
};
