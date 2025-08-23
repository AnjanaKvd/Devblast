import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;
    const filename = req.body.filename || file.filename;
    
    // Create the full URL for accessing the image
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    
    res.status(200).json({
      message: 'Image uploaded successfully',
      filename: filename,
      url: imageUrl,
      path: file.path
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
};
