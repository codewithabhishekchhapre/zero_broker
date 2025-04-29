const Ads=require("../models/ads")

exports.createAd = async (req, res) => {
    try {
      const { title, description, redirect_url, start_date, end_date, status, placement } = req.body;
  
      if (!req.files || !req.files.image_url || req.files.image_url.length === 0) {
        return res.status(400).json({
           error: 'Image upload failed or no image provided' 
          });
      }
  
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const imageUrls = req.files.image_url.map(file => `${baseUrl}/uploads/ads/${file.filename}`);
  
      const ad = new Ads({
        title,
        description,
        image_url: imageUrls[0],
        redirect_url,
        start_date,
        end_date,
        status,
        placement,
      });
  
      await ad.save();
      res.status(201).json({
         success: true, 
         id: ad.id, 
         message: 'Ad created successfully'
         });

    } catch (error) {
      res.status(500).json({ 
        success: false,
         message: 'Error creating ad', 
         error: error.message
         });
    }
  };
  
  

exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ads.find();

    if (!ads || ads.length === 0) {
      return res.status(404).json({ success: false, message: "No ads found" });
    }
    res.status(200).json({ success: true, data: ads });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: "Error fetching ads",
      error: error.message 
    });
  }
};

exports.getAdById = async (req, res) => {
    try {
      const { id } = req.params;
      const ad = await Ads.findById(id);
  
      if (!ad) {
        return res.status(404).json({ 
            success: false, 
            message: "Ad not found" 
        });
      }
  
      res.status(200).json({ success: true, data: ad });
    } catch (error) {
      res.status(500).json({ 
        success: false,
         message: "Error fetching ad", 
         error: error.message
         });
    }
  };



exports.updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;
    console.log("==>",req.body)

    if (!title && !status) {
      return res.status(400).json({ 
        success: false, 
        message: "Title or Status is required to update"
       });
    }

    const updatedAd = await Ads.findByIdAndUpdate(
      id,
      { 
        ...(title && { title }),
        ...(status && { status }),
        updated_at: new Date()
      },
      { new: true }
    );

    if (!updatedAd) {
      return res.status(404).json({ 
        success: false,
         message: "Ad not found" 
        });
    }

    res.status(200).json({ 
      success: true, 
      message: "Ad updated successfully", 
      data: updatedAd
     });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Error updating ad", 
      error: error.message });
  }
};



  exports.deleteAd = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedAd = await Ads.findByIdAndDelete(id);
  
      if (!deletedAd) {
        return res.status(404).json({ success: false, message: "Ad not found" });
      }
  
      res.status(200).json({ 
        success: true, 
        message: "Ad deleted successfully"
       });
    } catch (error) {
      res.status(500).json({
         success: false,
          message: "Error deleting ad", 
          error: error.message 
        });
    }
  };