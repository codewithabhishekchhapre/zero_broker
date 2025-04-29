const express=require("express")
const {upload}=require("../utils/multer")
const adsController=require("../controllers/adsController")
const {authorizeRoles,refreshTokenVerify}=require("../middleware/authMiddleware")
const router=express.Router();

const uploadAds = upload.fields([{ name: 'image_url', maxCount: 5 }]);

// router.use("/create",uploadAds,authorizeRoles("admin"),adsController.createAd)
router.use("/create",uploadAds,adsController.createAd)
router.get('/', adsController.getAllAds);
router.get('/:id',adsController.getAdById)
router.put('/:id', adsController.updateAd); 
router.delete('/:id',adsController.deleteAd); 

module.exports=router                                                                                                  