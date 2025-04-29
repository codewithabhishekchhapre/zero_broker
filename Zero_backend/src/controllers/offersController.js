const Offer = require('../models/offer');

exports.createOffer = async (req, res) => {
  try {
    const { title, description, discount, valid_from, valid_to, property_type, location, status } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Image upload failed or no image provided' });
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    const imageUrls = req.files.image_url.map(file => `${baseUrl}/uploads/offers/${file.filename}`);

    const offer = new Offer({
      id: `offer_${Date.now()}`,
      title,
      description,
      image_url: imageUrls,
      discount,
      valid_from,
      valid_to,
      property_type,
      location,
      status
    });

    await offer.save();

    res.status(201).json({ message: 'Offer created successfully', offer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.getAllOffers = async (req, res) => {
    try {
      const { property_type, location, status } = req.query;
  
      const filter = {};
      if (property_type) filter.property_type = property_type;
      if (location) filter.location = location;
      if (status) filter.status = status;
  
      const offers = await Offer.find(filter);
  
      if (!offers || offers.length === 0) {
        return res.status(200).json([]);
      }
  
      const offerData = offers.map(offer => ({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        image_url: offer.image_url,
        discount: offer.discount,
        valid_from: offer.valid_from,
        valid_to: offer.valid_to,
        property_type: offer.property_type,
        location: offer.location,
        status: offer.status,
      }));
  
      res.status(200).json({
        success: true,
        message: "Offers retrieved successfully",
        offers: offerData,
      });
  
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving offers",
        error: error.message,
      });
    }
  };
  

