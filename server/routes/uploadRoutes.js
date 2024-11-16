import express from 'express';
import { uploadSingleFile, uploadMultipleFiles } from '../helper/cloudinaryUploader.js';

const router = express.Router();

// Single Image Upload
router.post('/upload/single', async (req, res) => {
  const { filePath } = req.body; // Accept file path and folder in the request body
  try {
    const uploadResult = await uploadSingleFile(filePath,  'Home');
    res.status(200).json({
      message: 'Image uploaded successfully',
      uploadResult,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading image', error });
  }
});

// Multiple Image Upload
router.post('/upload/multiple', async (req, res) => {
  const { filePaths } = req.body; // Accept array of file paths and folder in the request body
  try {
    const uploadResults = await uploadMultipleFiles(filePaths,  'Home');
    res.status(200).json({
      message: 'Images uploaded successfully',
      uploadResults,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading images', error });
  }
});

export default router;
