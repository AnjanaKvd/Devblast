import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadImage } from '../controllers/upload.controller.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Use custom filename from request body if provided, otherwise generate one
    const customFilename = req.body.filename;
    if (customFilename) {
      cb(null, customFilename);
    } else {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      cb(null, `${timestamp}-${file.originalname}`);
    }
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload route
router.post('/', upload.single('image'), uploadImage);

export default router;
