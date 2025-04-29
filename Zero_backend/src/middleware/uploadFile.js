const multer = require("multer");
const path = require("path");

// Configure storage for images and videos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const fileType = file.mimetype.startsWith("image") ? "images" : "videos";
        cb(null, `uploads/${fileType}/`);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter for images and videos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "video/mp4", "video/mov", "video/avi"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPEG, PNG, JPG images and MP4, MOV, AVI videos are allowed"), false);
    }
};

// Multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // Limit to 10MB per file
}).fields([
  { name: "images", maxCount: 5 },
  { name: "videos", maxCount: 5 }
]);

module.exports = upload;
