const multer = require('multer');
const multerS3 = require('multer-s3');
const s3 = require('./s3Config');
const fileFilter = require('./fileFilter');

const uploadToS3 = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const ext = file.originalname.split('.').pop();
      const timestamp = Date.now();
      const path = file.mimetype.startsWith('image/')
        ? `images/${timestamp}_${file.originalname}`
        : `videos/${timestamp}_${file.originalname}`;

      cb(null, path);
    }
  }),
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

module.exports = uploadToS3;
