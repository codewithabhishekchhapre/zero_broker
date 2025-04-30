const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const { uploadDriverMedia } = require("../utils/multer");
// const authMiddleware = require('../middlewares/authMiddleware');
// const roleMiddleware = require('../middlewares/roleMiddleware');
const {authorizeRoles,accessTokenVerify}=require("../middleware/authMiddleware")
const AssignDriver = require('../models/assignDrivers');

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
router.get('/driver/assignments/me', accessTokenVerify, authorizeRoles('driver'), assignmentController.getDriverAssignments);

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

// Random Forest

// assign driver
router.post('/assign-driver', async (req, res) => {
  try {
    // console.log(req.user._id);
    const assignDriver = new AssignDriver({
      ...req.body,
      // agentId: req.user._id
    });

    await assignDriver.save();
    res.status(201).json({ message: 'New driver assignment created', data: assignDriver });
  } catch (error) {
    console.error('Error creating assignment:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});


// Random Forest

module.exports = router;