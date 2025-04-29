const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { uploadDriverMedia } = require("../utils/multer");
// const authMiddleware = require('../middlewares/authMiddleware');
// const roleMiddleware = require('../middlewares/roleMiddleware');
const {authorizeRoles,accessTokenVerify}=require("../middleware/authMiddleware")

// Agent routes
router.post(
  '/assign',
  accessTokenVerify,
  authorizeRoles('agent'),
  assignmentController.assignProperty
);

// Agent routes
router.get('/agent/assignments', accessTokenVerify, authorizeRoles('agent'), assignmentController.getAgentAssignments);

// Driver routes
router.get('/driver/assignments', accessTokenVerify, authorizeRoles('driver'), assignmentController.getDriverAssignments);

router.put(
 '/assignments/:assignmentId/review',
  accessTokenVerify,
  authorizeRoles('agent'),
  assignmentController.reviewSubmission
);


router.post(
  "/assignments/media",
  accessTokenVerify,
  authorizeRoles('driver'),
  uploadDriverMedia,
  assignmentController.uploadMediaAndLocation
);


// routes/assignmentRoutes.js
router.get(
  '/assignments/submissions',
  accessTokenVerify,
  authorizeRoles('agent'),
  assignmentController.getDriverSubmissions
);

// Common routes
// router.get(
//   '/',
//   accessTokenVerify,
//   authorizeRoles('agent', 'driver'),
//   assignmentController.getAssignments
// );

module.exports = router;