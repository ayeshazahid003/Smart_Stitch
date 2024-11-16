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
        public_id: folder,
    });
    return result;
  } catch (error) {
    console.error('Error uploading single file:', error);
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
