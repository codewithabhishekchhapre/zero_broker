const express = require('express');
const router = express.Router();
const propertyreviewsController=require("../controllers/propertyReviewController")
const {authorizeRoles,accessTokenVerify}=require("../middleware/authMiddleware")

router.post("/create",accessTokenVerify,authorizeRoles("buyer"),propertyreviewsController.createreviews)
router.get('/:property_id',accessTokenVerify,authorizeRoles("seller"),propertyreviewsController.getPropertyReviews)
router.put("/",accessTokenVerify,authorizeRoles("seller"),propertyreviewsController.updateReview)

module.exports=router;