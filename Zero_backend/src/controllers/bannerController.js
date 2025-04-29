const Banner = require('../models/Banner');

exports.createBanner = async (req, res) => {
  try {
    const { title, property_type, location, status } = req.body;
    // console.log("==>", req.body);
    // console.log("Uploaded Files:", req.files);
    
    redirect_url="https://example.com"

    if (!req.files || !req.files.image_url || req.files.image_url.length === 0) {
      return res.status(400).json({ error: 'Image upload failed or no image provided' });
    }
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    
    const imageUrls = req.files.image_url.map(file => `${baseUrl}/uploads/banners/${file.filename}`);


    const banner = new Banner({
      title,
      image_url: imageUrls,
      redirect_url,
      property_type,
      location,
      status
    });

    await banner.save();

    res.status(201).json({
      success:true,
      id: banner.id,
      image_url: imageUrls,
      message: 'Banner created successfully'
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error in creating banners ",
      error: error.message 
    });
  }
};


// exports.getAllBanners = async (req, res) => {
//   try {
//     const banners = await Banner.find({});
//     if (!banners || banners.length === 0) {
//       return res.status(200).json([]); 
//     }

    
//     const Banners = banners.map(banner => ({
//       id: banner.id,
//       title: banner.title,
//       image_url: banner.image_url,
//       redirect_url: banner.redirect_url,
//       property_type: banner.property_type,
//       location: banner.location,
//       status: banner.status,
//     }));

//     res.status(200).json( {
//       success: true,
//        message: "Banners retrieved successfully",
//        Banners
//       });

//   } catch (error) {
//     res.status(500).json({ 
//       success: false,
//       message: "Error in receving banners ",
//       error: error.message
//      });
//   }
// };

exports.getAllBanners = async (req, res) => {
  try {
    const { property_type, location, status } = req.query;
    console.log("==>request",req.query)

    const filter = {};
    if (property_type) filter.property_type = property_type;
    if (location) filter.location = location;
    if (status) filter.status = status;

    const banners = await Banner.find(filter);

    if (!banners || banners.length === 0) {
      return res.status(200).json([]);
    }

    const bannerData = banners.map(banner => ({
      id: banner.id,
      title: banner.title,
      image_url: banner.image_url,
      redirect_url: banner.redirect_url,
      property_type: banner.property_type,
      location: banner.location,
      status: banner.status,
    }));

    res.status(200).json({
      success: true,
      message: "Banners retrieved successfully",
      banners: bannerData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving banners",
      error: error.message,
    });
  }
};


