const express = require('express');
const router = express.Router();
const requestedPropertyController = require('../controllers/requestedPropertyController');
const { accessTokenVerify, authorizeRoles } = require('../middleware/authMiddleware');

// Seller creates a request
// Seller views all requested properties
router.get(
     '/my-requests',
     accessTokenVerify,
     authorizeRoles('seller'),
     requestedPropertyController.getMyRequestedProperties
   );
   
   // Agent views all accepted requests by them
   router.get(
     '/accepted-by-me',
     accessTokenVerify,
     authorizeRoles('agent'),
     requestedPropertyController.getAcceptedRequestsByAgent
   );
   
   // Seller views which agent accepted their request
   router.get(
     '/accepted-agents',
     accessTokenVerify,
     authorizeRoles('seller'),
     requestedPropertyController.getAcceptedAgentsForMyRequests
   );
   
router.post(
     '/create',
     accessTokenVerify,
     authorizeRoles('seller'),
     requestedPropertyController.createRequest
);

// Agents view all pending requests
router.get(
     '/pending',
     accessTokenVerify,
     authorizeRoles('agent'),
     requestedPropertyController.getAllRequestsForAgents
);

// Agent accepts a request
router.put(
     '/accept/:id',
     accessTokenVerify,
     authorizeRoles('agent'),
     requestedPropertyController.acceptRequest
);








//amin routes
// Admin views all property requests
router.get(
     '/admin/all-requests',
     accessTokenVerify,
     authorizeRoles('admin'),
     requestedPropertyController.getAllRequests
   );
   
   // Admin views all pending requests
   router.get(
     '/admin/pending-requests',
     accessTokenVerify,
     authorizeRoles('admin'),
     requestedPropertyController.getPendingRequests
   );
   
   // Admin views all accepted requests
   router.get(
     '/admin/accepted-requests',
     accessTokenVerify,
     authorizeRoles('admin'),
     requestedPropertyController.getAcceptedRequests
   );
   
   // Admin deletes a request
   router.delete(
     '/admin/delete-request/:id',
     accessTokenVerify,
     authorizeRoles('admin'),
     requestedPropertyController.deleteRequest
   );
   

   module.exports = router;