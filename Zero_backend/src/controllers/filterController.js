const Property = require("../models/Property");
const Filter = require("../models/Filter");


const saveFilter = async (req, res) => {
    try {
        const userId = req.user.id; // Extract from middleware
        const { filterName, city, emirate, bedrooms, bathrooms, purpose, minPrice, maxPrice } = req.body;

        if (!filterName) {
            return res.status(400).json({ success: false, message: "Filter name is required" });
        }

        const newFilter = new Filter({
            userId,
            filterName,
            city,
            emirate,
            bedrooms,
            bathrooms,
            purpose,
            minPrice,
            maxPrice
        });

        await newFilter.save();

        res.status(201).json({
            success: true,
            message: "Filter saved successfully",
            data: newFilter
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getMyFilters = async (req, res) => {
    try {
        const userId = req.user.id; // Extract from middleware

        const filters = await Filter.find({ userId }).sort({ created_at: -1 });

        res.status(200).json({
            success: true,
            count: filters.length,
            data: filters
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getFilteredProperties = async (req, res) => {
  try {
      const { city, emirate, bedrooms,purpose, bathrooms, minPrice, maxPrice } = req.body;

      let filter = {};

      if (city) filter["location.city"] = { $regex: city, $options: "i" };
      if (emirate) filter["location.emirate"] = { $regex: emirate, $options: "i" };
      if (bedrooms) filter["details.bedrooms"] = parseInt(bedrooms);
      if (bathrooms) filter["details.bathrooms"] = parseInt(bathrooms);
      if (purpose) filter["details.purpose"]={ $regex: purpose, $options: "i" };
      if (minPrice || maxPrice) {
          filter.price = {};
          if (minPrice) filter.price.$gte = parseInt(minPrice);
          if (maxPrice) filter.price.$lte = parseInt(maxPrice);
      }

      const properties = await Property.find(filter);
      res.status(200).json({
          success: true,
          count: properties.length,
          data: properties
      });
  } catch (error) {
      console.error(error); 
      res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {saveFilter, getMyFilters,getFilteredProperties};
