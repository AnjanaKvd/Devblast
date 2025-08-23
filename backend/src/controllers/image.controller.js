import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GET /api/images/:imageName - Retrieve image by name from uploads directory
export const getImage = async (req, res) => {
  try {
    const { imageName } = req.params;
    
    // Construct the file path
    const imagePath = path.join(__dirname, '../../../uploads', imageName);
    
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'Image not found' 
      });
    }
    
    // Get file extension to set appropriate content type
    const ext = path.extname(imageName).toLowerCase();
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    }[ext] || 'application/octet-stream';
    
    // Set headers and send file
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    
    // Stream the file
    const fileStream = fs.createReadStream(imagePath);
    fileStream.pipe(res);
    
  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};
