const express = require('express');
const { createOffer ,getAllOffers} = require('../controllers/offersController');
const {upload} = require('../utils/multer');


const router = express.Router();
const uploadImages = upload.fields([{ name: 'image_url', maxCount: 5 }]);

router.post('/', uploadImages, createOffer);
router.get("/alloffers", getAllOffers);

module.exports = router;
