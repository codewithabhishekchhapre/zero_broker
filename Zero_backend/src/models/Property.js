const mongoose =require("mongoose")
const PropertySchema = new mongoose.Schema({
    name: { type: String },
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, required: true },

    location: {
        country: { type: String, default: "" },
        emirate: { type: String, default: "" },
        city: { type: String, default: "" },
        landmark: { type: String, default: "" },
        address: { type: String, default: "" },
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
        neighborhood: { type: String, default: "" },
        street: { type: String, default: "" },
        floor: { type: Number, default: null },
        apartment_number: { type: String, default: "" }
    },

    details: {
        property_type: { type: String, default: "" },
        purpose: { type: String, default: "" },
        bedrooms: { type: Number, default: 0 },
        bathrooms: { type: Number, default: 0 },
        usage: { type: String, default: "" },
        size: {
            value: { type: Number, default: 0 },
            unit: { type: String, default: "" }
        },
        completion_status: { type: String, default: "" },
        furnishing: { type: String, default: "" },
        ownership: { type: String, default: "" },
        parking_available: { type: Boolean, default: false }
    },

    other_amenities: { type: [String], default: [] },
    features_amenities: { type: [String], default: [] },

    building_information: {
        name: { type: String, default: "" },
        year_of_completion: { type: Number, default: null },
        total_floors: { type: Number, default: null },
        total_building_area: {
            value: { type: Number, default: 0 },
            unit: { type: String, default: "" }
        },
        offices: { type: Number, default: 0 }
    },

    reference_number: { type: String, default: "" },

    requested_id: { type: mongoose.Schema.Types.ObjectId, ref: "RequestedProperty" }, // Seller's initial request
    agent_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Agent who accepted and listed property

    approval_status: {
        visible_to_buyers: { type: Boolean, default: false },
        approved_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin ID who approved
        status: { type: String, enum: ["Approved", "Rejected", "Pending"], default: "Pending" },
        approved_on: { type: Date, default: null }
    },

    nearby_buildings: { type: [String], default: [] },
    listing_platform: { type: String, default: "" },

    developer_notes: {
        image_count: { type: Number, default: 0 },
        images: { type: [String], default: [] },
        video_count: { type: Number, default: 0 },
        videos: { type: [String], default: [] },
        video_available: { type: Boolean, default: false },
        virtual_tour_available: { type: Boolean, default: false },
        tags: { type: [String], default: [] }
    },

    created_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Property', PropertySchema);
