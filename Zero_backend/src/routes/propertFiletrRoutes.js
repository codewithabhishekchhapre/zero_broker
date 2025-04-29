const express = require("express");
const router = express.Router();
const {authorizeRoles,accessTokenVerify}=require("../middleware/authMiddleware")
const filterController=require("../controllers/filterController")

router.get('/filter',filterController.getFilteredProperties)
router.post("/savefilter", accessTokenVerify, filterController.saveFilter); // Save filter
router.get("/myfilter", accessTokenVerify, filterController.getMyFilters); // Get my filters

module.exports = router;