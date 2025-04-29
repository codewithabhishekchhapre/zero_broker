const express = require("express");
const { updateProfile, getProfile } = require("../controllers/profileController");
const { uploadSingle } = require("../utils/multer");
const { accessTokenVerify, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.put(
     "/update",
      accessTokenVerify,
       uploadSingle("userprofile"),
        updateProfile
     );
router.get(
     "/me", 
     accessTokenVerify
     , getProfile);

module.exports = router;
