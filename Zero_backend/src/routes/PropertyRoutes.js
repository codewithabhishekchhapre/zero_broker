const propertyController = require("../controllers/PropertyController");
const express = require("express");
const router = express.Router();
const {upload} = require("../utils/multer"); 
const {authorizeRoles,accessTokenVerify}=require("../middleware/authMiddleware")

const uploadfiles = upload.fields([{ name: "images", maxCount: 15 }, { name: "videos", maxCount: 2 }])

// Route to get all approved properties
router.get("/approved", propertyController.getApprovedProperties);
router.get("/propertyById/:id", propertyController.getPropertyById);

router.post("/create",accessTokenVerify, 
  authorizeRoles("agent"), 
  uploadfiles,
  propertyController.createProperty);

router.patch("/update/:id",accessTokenVerify,
    authorizeRoles("admin"),
     uploadfiles,
      propertyController.updateProperty);



router.post("/approve/:id",accessTokenVerify, authorizeRoles("admin"),propertyController.approveProperty);

router.get("/getProperties",accessTokenVerify, authorizeRoles("admin"), propertyController.getAllProperties); 

router.get("/getPropertiesByAgent/:id",accessTokenVerify, authorizeRoles("agent"),propertyController.getPropertiesByAgent)

router.delete("/delete/:id",accessTokenVerify, authorizeRoles("admin"), propertyController.deleteProperty); 

module.exports = router;