const express = require('express');
const { createBanner,getAllBanners } = require('../controllers/bannerController');
const {upload} = require('../utils/multer');

const router = express.Router();
const uploadBanners = upload.fields([{ name: 'image_url', maxCount: 5 }]);


router.post('/create', uploadBanners, createBanner);
router.get('/', getAllBanners);

module.exports = router;
