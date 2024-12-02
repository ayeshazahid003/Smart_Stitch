import cloudinary from '../cloudinaryConfig.js';

/**
 * Upload a single file to Cloudinary.
 * @param {string} filePath - Path to the file to be uploaded.
 * @param {string} folder - Folder name in Cloudinary.
 * @returns {Promise<Object>} - Upload result from Cloudinary.
 */
export const uploadSingleFile = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder, // Organize files under the specified folder
      resource_type: "auto", // Ensure it supports all file types (image/video)
      public_id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Unique public ID
      overwrite: false, // Prevent overwriting existing files
    });
    return result; // Contains secure_url and other metadata
  } catch (error) {
    console.error("Error uploading single file:", error);
    throw error;
  }
};


/**
 * Upload multiple files to Cloudinary.
 * @param {Array<string>} filePaths - Array of file paths.
 * @param {string} folder - Folder name in Cloudinary.
 * @returns {Promise<Array<Object>>} - Array of upload results.
 */
export const uploadMultipleFiles = async (filePaths, folder) => {
  try {
    const uploadPromises = filePaths.map((path) =>
      cloudinary.uploader.upload(path, {
        public_id: folder,
      })
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};
