const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Base URL configuration

const BASE_URL = process.env.DOMAIN || "http://localhost:8000";

// Define paths
const srcDir = path.join(__dirname, "..");
const uploadDir = path.join(srcDir, "uploads");
const imagesDir = path.join(uploadDir, "images");
const videosDir = path.join(uploadDir, "videos");
const bannersDir = path.join(uploadDir, "banners");
const offersDir = path.join(uploadDir, "offers");
const adsDir = path.join(uploadDir, "ads");
const driverMediaDir = path.join(uploadDir, "driver-media");

// Create directories if they don't exist
const createDirectories = () => {
  const dirs = [uploadDir, imagesDir, videosDir, bannersDir, offersDir, adsDir, driverMediaDir];
  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};
createDirectories();

// Common file filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images and videos are allowed!"), false);
  }
};

// Helper function to generate public URL
const generatePublicUrl = (file, folder) => {
  return `${BASE_URL}/uploads/${folder}/${file.filename}`;
};

// Main storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    createDirectories(); // Ensure folders exist
    
    if (file.mimetype.startsWith("image/")) {
      if (req.url.includes("/create")) {
        cb(null, bannersDir);
      } else if (req.baseUrl.includes("/offers")) {
        cb(null, offersDir);
      } else if (req.baseUrl.includes("/ads")) {
        cb(null, adsDir);
      } else {
        cb(null, imagesDir);
      }
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, videosDir);
    } else {
      cb(new Error("Invalid file type"), false);
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Driver media specific storage
const driverMediaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    createDirectories();
    cb(null, driverMediaDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Create upload instances
const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: fileFilter
});

const driverMediaUpload = multer({
  storage: driverMediaStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: fileFilter
});

// Middleware to add file URLs to request
const DRIVER_MEDIA_PATH = 'driver-media';

// Modify the addFileUrls middleware
const addFileUrls = (req, res, next) => {
  if (req.files) {
    // Handle array of files
    if (Array.isArray(req.files)) {
      req.files.forEach(file => {
        const folder = file.mimetype.startsWith('image/') ? 
          (file.destination.includes('banners') ? 'banners' : 
           file.destination.includes('offers') ? 'offers' :
           file.destination.includes('ads') ? 'ads' : 
           file.destination.includes('driver-media') ? DRIVER_MEDIA_PATH : 'images') : 
          (file.destination.includes('driver-media') ? DRIVER_MEDIA_PATH : 'videos');
        file.url = generatePublicUrl(file, folder);
      });
    } 
    // Handle object with multiple fields (for driver media)
    else {
      Object.keys(req.files).forEach(field => {
        req.files[field].forEach(file => {
          const folder = file.mimetype.startsWith('image/') ? DRIVER_MEDIA_PATH : DRIVER_MEDIA_PATH;
          file.url = generatePublicUrl(file, folder);
        });
      });
    }
  }
  next();
};

// Export all upload functions
module.exports = {
  BASE_URL,
  upload,
  uploadSingle: (fieldName) => [upload.single(fieldName), addFileUrls],
  uploadMultiple: (fieldName, maxCount) => [upload.array(fieldName, maxCount), addFileUrls],
  uploadSingleVideo: (fieldName) => [upload.single(fieldName), addFileUrls],
  uploadMultipleVideos: (fieldName, maxCount) => [upload.array(fieldName, maxCount), addFileUrls],
  uploadDriverMedia: [driverMediaUpload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
  ]), addFileUrls],
  generatePublicUrl // Export the URL generator for use in controllers
};