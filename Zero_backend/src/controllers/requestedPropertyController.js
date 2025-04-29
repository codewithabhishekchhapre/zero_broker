const RequestedProperty = require("../models/RequestedProperty");

// Create a new requested property listing by seller
exports.createRequest = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        status: "failed",
        message: "Only sellers can request property listings.",
        error: "Access denied",
      });
    }

    const { propertyName, propertyType, purpose, area, address, location, reasonForSaleOrRent } = req.body;

    if (!propertyName || !propertyType || !purpose || !area || !address || !location) {
      return res.status(400).json({
        status: "failed",
        message: "All required fields must be filled.",
        error: "Missing required fields",
      });
    }

    const newRequest = await RequestedProperty.create({
      seller: req.user._id,
      propertyName,
      propertyType,
      purpose,
      area,
      address,
      location,
      reasonForSaleOrRent,
    });

    res.status(201).json({
      status: "success",
      message: "Property request submitted successfully.",
      data: newRequest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all pending property requests for agents
exports.getAllRequestsForAgents = async (req, res) => {
  try {
    // Fetch all pending requests with seller details
    const requests = await RequestedProperty.find({ status: "Pending" })
      .populate("seller", "fullname email mobile")
      .sort({ createdAt: -1 }) // Get seller name & email
      .lean(); // Optimize performance for read-only queries

    res.status(200).json({
      status: "success",
      message: requests.length
        ? "Pending property requests retrieved."
        : "No pending property requests found.",
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};
// Agent accepts a property request
exports.acceptRequest = async (req, res) => {
  try {
    // Find and update the request in a single query
    const request = await RequestedProperty.findOneAndUpdate(
      { _id: req.params.id, status: "Pending" }, // Only update if it's "Pending"
      {
        status: "Accepted",
        assignedAgent: req.user._id,
        acceptedAt: Date.now(),
      },
      { new: true } // Return updated document
    );

    // If no request was updated, it means it was either not found or not "Pending"
    if (!request) {
      return res.status(400).json({
        status: "failed",
        message: "Request not found or already processed.",
        error: {
          message: "The request ID may be incorrect or it's already Accepted/Rejected.",
        },
      });
    }

    res.status(200).json({
      status: "success",
      message: "Request accepted successfully.",
      data: request,
    });
  } catch (error) {
    console.error("Error accepting request:", error);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: { message: error.message },
    });
  }
};





//  Seller views all their requested properties
exports.getMyRequestedProperties = async (req, res) => {
  try {
    const myRequests = await RequestedProperty.find({ seller: req.user._id }).sort({ createdAt: -1 });;

    if (!myRequests.length) {
      return res.status(404).json({
        status: "failed",
        message: "You have not made any property requests.",
        error: "No data available",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Your requested properties retrieved successfully.",
      data: myRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};

//  Agent views all accepted requests by them
exports.getAcceptedRequestsByAgent = async (req, res) => {
  try {
    const acceptedRequests = await RequestedProperty.find({
      assignedAgent: req.user._id,
      status: "Accepted"
    })
      .populate("seller", "fullname email mobile")
      .sort({ createdAt: -1 })
      .select("_id propertyName propertyType purpose area address location reasonForSaleOrRent seller assignedAgent status acceptedAt createdAt");

    if (!acceptedRequests.length) {
      return res.status(404).json({
        status: "failed",
        message: "You have not accepted any property requests.",
        error: "No data available",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Accepted property requests retrieved successfully.",
      data: acceptedRequests.map(request => ({
        request_id: request._id, // Explicitly sending request_id
        propertyName: request.propertyName,
        propertyType: request.propertyType,
        purpose: request.purpose,
        area: request.area,
        address: request.address,
        location: request.location,
        reasonForSaleOrRent: request.reasonForSaleOrRent,
        seller: request.seller,
        assignedAgent: request.assignedAgent,
        status: request.status,
        acceptedAt: request.acceptedAt, // ✅ Include acceptedAt
        createdAt: request.createdAt
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};


//  Seller views which agent accepted their request
exports.getAcceptedAgentsForMyRequests = async (req, res) => {
  try {
    const acceptedRequests = await RequestedProperty.find({
      seller: req.user._id,
      status: "Accepted"
    }).populate("assignedAgent", "fullname email mobile")
    .sort({ createdAt: -1 });;

    if (!acceptedRequests.length) {
      return res.status(404).json({
        status: "failed",
        message: "No agents have accepted your property requests yet.",
        error:{
          message:"No data available"
        }
      });
    }

    res.status(200).json({
      status: "success",
      message: "Agents who accepted your property requests retrieved successfully.",
      data: acceptedRequests,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};




// admin api 

// Admin: Get all property requests
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await RequestedProperty.find()
      .populate("seller", "fullname email")
      .populate("assignedAgent", "fullname email") .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: "All property requests retrieved successfully.",
      data: requests,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
      data: null
    });
  }
};

// Admin: Get all pending requests
exports.getPendingRequests = async (req, res) => {
  try {
    const requests = await RequestedProperty.find({ status: "Pending" })
      .populate("seller", "fullname email")  .sort({ createdAt: -1 }); 

    res.status(200).json({
      status: "success",
      message: "Pending property requests retrieved successfully.",
      data: requests,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
      data: null
    });
  }
};

// Admin: Get all accepted requests
exports.getAcceptedRequests = async (req, res) => {
  try {
    const requests = await RequestedProperty.find({ status: "Accepted" })
      .populate("seller", "fullname email")
      .populate("assignedAgent", "fullname email") .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      message: "Accepted property requests retrieved successfully.",
      data: requests,
      error: null
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
      data: null
    });
  }
};

// Admin: Delete a request
exports.deleteRequest = async (req, res) => {
  try {
    const request = await RequestedProperty.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({
        status: "failed",
        message: "Property request not found.",
        error: "Invalid request ID",
      });
    }

    await request.deleteOne();

    res.status(200).json({
      status: "success",
      message: "Property request deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "Server error",
      error: error.message,
    });
  }
};
