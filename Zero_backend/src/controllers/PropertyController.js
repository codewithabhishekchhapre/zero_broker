const Property = require("../models/Property");
const nestify = require("../utils/nestify");
const parseFields = require("../utils/parseFields");
const RequestedProperty = require('../models/RequestedProperty');
const mongoose = require("mongoose");

const generateReferenceNumber = () => {
  const prefix = "PROP"; // Custom prefix
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const randomChars = Array.from({ length: 4 }, () => 
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join(""); // Generate 4 random uppercase letters (A-Z)
  
  return `${prefix}-${timestamp}-${randomChars}`;
};

exports.createProperty = async (req, res) => {
  try {
    // Check if agent_id (from token) and requested_id are provided
    if (!req.user.id) {
      return res.status(400).json({ success: false, message: "Agent ID is required" });
    }
    if (!req.body.requested_id) {
      return res.status(400).json({ success: false, message: "Requested ID is required" });
    }

    const nestedBody = nestify(req.body);
    const parsedData = parseFields(nestedBody, req.files);

    console.log("Parsed Data Before Saving: ", JSON.stringify(parsedData, null, 2));

    // Ensure agent_id and requested_id are stored
    const newProperty = new Property({
      ...parsedData,
      requested_id: nestedBody.requested_id,
      agent_id: req.user.id,
      reference_number: generateReferenceNumber(),
    });

    await newProperty.save();
    
    // Update the requested property's status to "Listed"
    await RequestedProperty.findByIdAndUpdate(nestedBody.requested_id, { status: "Listed" });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      property: newProperty,
    });

  } catch (error) {
    console.error("Error creating property:", error);

    // If files were uploaded but property creation failed, delete the uploaded files
    // if (req.files) {
    //   req.files.forEach((file) => {
    //     const filePath = path.join(__dirname, "../uploads", file.filename);
    //     fs.unlink(filePath, (err) => {
    //       if (err) console.error("Error deleting file:", err);
    //     });
    //   });
    // }

    res.status(500).json({
      success: false,
      message: "Property not created",
      error: error.message,
    });
  }
};


exports.updateProperty = async (req, res) => {
  try {
    const existingProperty = await Property.findById(req.params.id);
    if (!existingProperty) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    const nestedBody = nestify(req.body);
    const parsedData = parseFields(nestedBody, req.files);

    // ✅ Merge existing nested fields with new data
    const updatedFields = { ...existingProperty._doc }; // Start with existing data
    Object.keys(parsedData).forEach((key) => {
      if (typeof parsedData[key] === "object" && parsedData[key] !== null) {
        // ✅ Merge nested objects instead of replacing them
        updatedFields[key] = { ...existingProperty[key], ...parsedData[key] };
      } else {
        updatedFields[key] = parsedData[key]; // Directly update non-objects
      }
    });

    // ✅ Perform update
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error("Error updating property:", error);
    res.status(500).json({
      success: false,
      message: "Property not updated",
      error: error.message,
    });
  }
};



exports.approveProperty = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch property to check current approval status
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: "Property not found" });
    }

    // Check if property is already approved
    if (property.approval_status.status === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Property is already approved",
      });
    }

    // Update property approval status
    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      { 
        "approval_status.visible_to_buyers": true,
        "approval_status.approved_by": userId,
        "approval_status.status": "Approved",
        "approval_status.approved_on": new Date()  // ✅ Store approval date
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Property approved successfully",
      property: updatedProperty
    });
  } catch (error) {
    console.error("Error approving property:", error);
    res.status(500).json({
      success: false, 
      message: "Property not approved", 
      error: error.message
    });
  }
};

//  exports.getApprovedProperties = async (req, res) => {
//   try {
//       const approvedProperties = await Property.find({ "approval_status.status": "Approved" });
//       res.status(200).json({ success: true, data: approvedProperties });
//   } catch (error) {
//       console.error("Error fetching approved properties:", error);
//       res.status(500).json({ success: false, message: "Server Error" });
//   }
// };
exports.getApprovedProperties = async (req, res) => {
  try {
      const approvedProperties = await Property.find(
          { "approval_status.status": "Approved" },
          {
              requested_id: 0,
              agent_id: 0,
              approval_status: 0,
              building_information: 0,
              other_amenities: 0,
              features_amenities: 0,
              nearby_buildings:0,
              reference_number:0,
              description:0
          }
      );

      res.status(200).json({ success: true, data: approvedProperties });
  } catch (error) {
      console.error("Error fetching approved properties:", error);
      res.status(500).json({ success: false, message: "Server Error" });
  }
};


exports.getPropertyById = async (req, res) => {
  try {
      const { id } = req.params;
      console.log(id)

      // Fetch property and exclude only agent_id, requested_id, and approval_status
      const property = await Property.findById(id)

      if (!property) {
          return res.status(404).json({ success: false, message: "Property not found" });
      }

      res.status(200).json({ success: true, data: property });

  } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ success: false, message: "Server Error" });
  }
};



exports.getAllProperties = async (req,res) => {
  try {
    const properties = await Property.find();
    res.status(200).json({ success: true, message: "Properties retrieved successfully", properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Properties not retrieved", error: error.message });
  }
};


exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    res.status(200).json({ success: true, data: property });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: "Property not found" });

    res.status(200).json({ success: true, message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};



exports.getPropertiesByAgent = async (req, res) => {
  try {
    const agentId = req.user.id; 
    console.log("===>agentId",agentId)

    // Find properties and populate the requestedProperty to get assignedAgent
    const properties = await Property.find({})
      .populate({
        path: 'requested_id',
        model: 'RequestedProperty',
        populate: {
          path: 'assignedAgent',
          model: 'User',
          select: 'name email',
        }
      })
      .populate('approval_status.approved_by', 'name email');

      console.log("===>properties",properties)
    // Filter properties where the assignedAgent matches the agentId
    const filteredProperties = properties.filter(property =>
      property.requested_id?.assignedAgent?._id.toString() === agentId
    );
console.log("filteredProperties==>",filteredProperties)
    res.status(200).json({
      success: true,
      count: filteredProperties.length,
      data: filteredProperties,
    });
  } catch (error) {
    console.error("Error in getAgentProperties:", error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
