const Assignment = require('../models/Assignment');
const Property = require('../models/Property');
const User = require('../models/User');
const path=require("path")
const fs=require("fs")
const mongoose = require('mongoose');

exports.assignProperty = async (req, res) => {
  try {
    const { propertyId, driverId } = req.body;
    const agentId = req.user.id;

    // Validate request body
    if (!propertyId || !driverId) {
      return res.status(400).json({ message: 'propertyId and driverId are required' });
    }

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if driver exists and is a driver
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(400).json({ message: 'Invalid driver' });
    }

    // Check if assignment already exists with full driver details
    const existingAssignment = await Assignment.findOne({ 
      propertyId, 
      driverId,
      status: { $nin: ['rejected', 'declined'] }
    }).populate('driverId', 'fullname mobile email vehicleInfo');

    if (existingAssignment) {
      return res.status(409).json({ 
        success: false,
        message: 'This property is already assigned to a driver',
        data: {
          existingAssignment: {
            _id: existingAssignment._id,
            status: existingAssignment.status,
            assignedAt: existingAssignment.createdAt,
            driver: existingAssignment.driverId, // Full driver details
            currentAgent: existingAssignment.agentId // If you want agent info too
          },
          attemptedAssignment: {
            propertyId,
            driverId,
            agentId
          }
        }
      });
    }

    // Create new assignment
    const assignment = new Assignment({
      propertyId,
      agentId,
      driverId,
      status: 'pending'
    });

    await assignment.save();

    // Populate the response
    const populatedAssignment = await Assignment.findById(assignment._id)
      .populate('propertyId', 'address price')
      .populate('driverId', 'fullname mobile email');

    res.status(201).json({
      success: true,
      message: 'Property assigned successfully',
      data: populatedAssignment
    });

  } catch (error) {
    console.error('Assignment error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to assign property',
      error: error.message 
    });
  }
};

// Get all drivers assigned by agent with property details
exports.getAgentAssignments = async (req, res) => {
  try {
    const agentId = req.user.id;
    console.log(agentId)

    const assignments = await Assignment.find({ agentId })
      .populate({
        path: 'propertyId',
        select: 'title price location.address details.property_type requested_id',
        populate: {
          path: 'requested_id',
          select: 'seller propertyName',
          populate: {
            path: 'seller',
            select: 'fullname phone email'
          }
        }
      })
      .populate('driverId', 'fullname mobile email vehicleInfo')
      .sort({ createdAt: -1 });

    const formattedAssignments = assignments.map(assignment => {
      const property = assignment.propertyId;
      const requestedProperty = property.requested_id;
      
      return {
        _id: assignment._id,
        status: assignment.status,
        assignedAt: assignment.createdAt,
        driver: assignment.driverId,
        property: {
          _id: property._id,
          title: property.title,
          price: property.price,
          address: property.location.address,
          type: property.details.property_type,
          seller: requestedProperty ? {
            _id: requestedProperty.seller._id,
            fullname: requestedProperty.seller.fullname,
            phone: requestedProperty.seller.phone,
            email: requestedProperty.seller.email
          } : null
        }
      };
    });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: formattedAssignments
    });

  } catch (error) {
    console.error('Error fetching agent assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch agent assignments',
      error: error.message
    });
  }
};

// Get all properties assigned to driver with agent details

exports.getDriverAssignments = async (req, res) => {
  try {
    const driverId = req.user._id;
    console.log("Looking for driver ID:", driverId, "in collection 'assigndrivers'");

    // Make sure we're using the right model with correct collection
    const Assignment = mongoose.model('Assignment');
    
    // Try direct query first with proper ObjectId
    let driverObjectId;
    try {
      driverObjectId = mongoose.Types.ObjectId.isValid(driverId) 
        ? new mongoose.Types.ObjectId(driverId.toString()) 
        : driverId;
    } catch (err) {
      console.error("Error converting driver ID:", err);
      driverObjectId = driverId;
    }

    // Query the correct collection
    const assignments = await Assignment.find({ driverId: driverObjectId })
      .select('_id driverId propertyId locationDetails visitingDate visitingTime status createdAt updatedAt')
      .sort({ createdAt: -1 });

    console.log(`Found ${assignments.length} assignments for driver ${driverId}`);

    const formattedAssignments = assignments.map(assignment => {
      return {
        _id: assignment._id,
        driverId: assignment.driverId,
        propertyId: assignment.propertyId,
        locationDetails: assignment.locationDetails,
        visitingDate: assignment.visitingDate,
        visitingTime: assignment.visitingTime,
        status: assignment.status,
        assignedAt: assignment.createdAt,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt
      };
    });


    res.status(200).json({
      success: true,
      count: assignments.length,
      data: formattedAssignments
    });

  } catch (error) {
    console.error('Error fetching driver assignments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch driver assignments',
      error: error.message
    });
  }
};


// Get all driver media submissions with property details (for agent)
exports.getDriverSubmissions = async (req, res) => {
  try {
    const agentId = req.user.id;

    // Find all assignments for this agent with media uploads
    const assignments = await Assignment.find({
      agentId,
      status: { $in: ['media_uploaded', 'approved', 'rejected'] } // Include multiple statuses
    })
    .populate({
      path: 'driverId',
      select: 'fullname mobile vehicleInfo profilePhoto'
    })
    .populate({
      path: 'propertyId',
      select: 'title price location details requested_id',
      // populate: [{
      //   path: 'seller',
      //   select: 'fullname phone email'
      // }, {
      //   path: 'requested_id',
      //   select: 'propertyName'
      // }]
    })
    .sort({ updatedAt: -1 });

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No driver submissions found for your properties'
      });
    }

    // Format response data according to schema
    const formattedSubmissions = assignments.map(assignment => {
      const property = assignment.propertyId;
      const driver = assignment.driverId;
      const requestedProperty = property.requested_id;

      return {
        assignmentId: assignment._id,
        status: assignment.status,
        submittedAt: assignment.updatedAt,
        driver: {
          id: driver?._id,
          name: driver?.fullname,
          mobile: driver?.mobile,
          vehicle: driver?.vehicleInfo,
          profilePhoto: driver?.profilePhoto
        },
        property: {
          id: property?._id,
          title: property?.title || requestedProperty?.propertyName,
          price: property?.price,
          address: property?.location?.address,
          type: property?.details?.property_type,
          seller: property?.seller ? {
            name: property.seller.fullname,
            phone: property.seller.phone,
            email: property.seller.email
          } : null
        },
        media: assignment.media?.map(mediaItem => ({
          url: mediaItem.url,
          type: mediaItem.type,
          uploadedAt: mediaItem.uploadedAt
        })) || [],
        location: assignment.location || null,
        feedback: assignment.agentFeedback,
        canApprove: assignment.status === 'media_uploaded'
      };
    });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: formattedSubmissions
    });

  } catch (error) {
    console.error('Error fetching driver submissions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch driver submissions',
      error: error.message
    });
  }
};

exports.uploadMediaAndLocation = async (req, res) => {
  try {
    const { assignmentId, longitude, latitude } = req.body;
    const driverId = req.user.id;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      driverId,
    });

    if (!assignment) {
      // Clean up uploaded files if assignment not found
      if (req.files) {
        const files = Object.values(req.files).flat();
        files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(404).json({ 
        success: false,
        message: 'Assignment not found' 
      });
    }

    const media = [];
    
    // Process all files (both images and videos)
    if (req.files) {
      const files = Object.values(req.files).flat();
      files.forEach(file => {
        media.push({
          url: file.url, // Using the URL generated by middleware
          type: file.mimetype.startsWith('image/') ? 'image' : 'video',
          uploadedAt: Date.now()
        });
      });
    }

    // Update assignment
    assignment.media = media;
    
    if (longitude && latitude) {
      assignment.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      };
    }
    
    assignment.status = 'media_uploaded';
    await assignment.save();

    res.status(200).json({
      success: true,
      data: assignment
    });

  } catch (error) {
    console.error('Error uploading media:', error);
    // Clean up files on error
    if (req.files) {
      const files = Object.values(req.files).flat();
      files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (err) {
          console.error('Error deleting file:', err);
        }
      });
    }
    res.status(500).json({
      success: false,
      message: 'Failed to upload media',
      error: error.message
    });
  }
};

// Agent reviews driver's submission
exports.reviewSubmission = async (req, res) => {
  try {
    const { assignmentId } = req.params; // Changed from body to params
    const { status, feedback } = req.body;
    const agentId = req.user.id;

    // Validate input
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be either "approved" or "rejected"'
      });
    }

    // Find and validate assignment
    const assignment = await Assignment.findOneAndUpdate(
      {
        _id: assignmentId,
        agentId,
        status: 'media_uploaded' // Only allow review if in this state
      },
      {
        status,
        agentFeedback: feedback,
        updatedAt: new Date() // Explicitly update timestamp
      },
      { new: true } // Return the updated document
    )
    .populate('driverId', 'fullname mobile') // Include driver info
    .populate('propertyId', 'title location.address'); // Include property info

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found, already processed, or not authorized'
      });
    }

    // Format response
    const response = {
      success: true,
      data: {
        assignmentId: assignment._id,
        status: assignment.status,
        feedback: assignment.agentFeedback,
        updatedAt: assignment.updatedAt,
        driver: {
          id: assignment.driverId._id,
          name: assignment.driverId.fullname,
          mobile: assignment.driverId.mobile
        },
        property: {
          id: assignment.propertyId._id,
          title: assignment.propertyId.title,
          address: assignment.propertyId.location?.address
        }
      }
    };

    // Optional: Send notification to driver
    await Notification.create({
      userId: assignment.driverId._id,
      title: 'Submission Reviewed',
      message: `Your submission has been ${status} by the agent`,
      type: 'assignment_review'
    });

    res.status(200).json(response);

  } catch (error) {
    console.error('Error reviewing submission:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review submission',
      error: error.message
    });
  }
};

// not used 
// // Get assignments for user based on role
// exports.getAssignments = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const role = req.user.role;
    
//     let assignments;
    
//     if (role === 'agent') {
//       assignments = await Assignment.find({ agentId: userId })
//         .populate('driverId', 'fullname email mobile')
//         .populate('propertyId');
//     } else if (role === 'driver') {
//       assignments = await Assignment.find({ driverId: userId })
//         .populate('agentId', 'fullname email mobile')
//         .populate('propertyId');
//     } else {
//       return res.status(403).json({ message: 'Unauthorized' });
//     }

//     res.json(assignments);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };