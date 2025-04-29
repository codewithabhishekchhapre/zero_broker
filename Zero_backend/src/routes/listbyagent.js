// Random Forest

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const { accessTokenVerify, authorizeRoles } = require('../middleware/authMiddleware');

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, '..', 'uploads', 'property-documents');

// Ensure upload directory exists before setting up multer
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created directory: ${uploadDir}`);
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  }
});

// File filter to only accept PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

// Error handling middleware for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the 10MB limit'
      });
    }
    return res.status(400).json({
      success: false,
      message: `Multer error: ${err.message}`
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

// Endpoint to handle property listing with PDF upload
router.post(
  '/property-listings-by-agent',
  accessTokenVerify, 
  authorizeRoles('seller'), 
  upload.single('propertyPDF'),
  handleMulterError,
  async (req, res) => {
    try {
      const formData = req.body;
      
      let fileData = null;
      if (req.file) {
        fileData = {
          filename: req.file.filename,
          originalName: req.file.originalname,
          path: req.file.path,
          size: req.file.size
        };
      }
      
      console.log('Form data received:', req.body);
      console.log('File details:', req.file);

    //   res.status(201).json({
    //           success: true,
    //           message: 'Property listing created successfully',
    //         //   listingId: propertyListing.id
    //         });
      
      try {
        const PropertyListing = require('../models/PropertyListing');
        
        const propertyListing = await PropertyListing.create({
          ...formData,
          userId: req.user.id,
          documentPath: fileData ? fileData.path : null,
          documentName: fileData ? fileData.originalName : null
        });
        
        res.status(201).json({
          success: true,
          message: 'Property listing created successfully',
          listingId: propertyListing.id
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        throw new Error(`Database operation failed: ${dbError.message}`);
      }
      
    } catch (error) {
      console.error('Error saving property listing:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create property listing',
        error: error.message
      });
    }
  }
);

module.exports = router;

// Random Forest