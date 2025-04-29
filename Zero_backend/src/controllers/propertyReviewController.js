
// const PropertyReview = require('../models/propertyReview');


// exports.createreviews = async (req, res) => {
//   const { property_id, mssg, rating } = req.body;
//   buyer_id = req.user._id
//   console.log("====>",buyer_id)
//   try {
//     const newReview = new PropertyReview({
//          property_id, 
//          buyer_id, 
//          mssg, 
//          rating 
//         });
//     await newReview.save();

//     res.status(201).json({
//         status:true,
//          message: 'Review added successfully',
//           review: newReview
//          });
//   } catch (error) {
//     res.status(500).json({ 
//         status:false,
//         error: error.message 
//     });
//   }
// };

const PropertyReview = require('../models/propertyReview');

exports.createreviews = async (req, res) => {
  const { property_id, mssg, rating } = req.body;
  const buyer_id = req.user._id;

  try {
    let propertyReview = await PropertyReview.findOne({ property_id });

    if (propertyReview) {
      
      propertyReview.buyer_id.push(buyer_id);
      propertyReview.mssg = mssg;
      propertyReview.rating = rating;
    } else {
     
      propertyReview = new PropertyReview({
        property_id,
        buyer_id: [buyer_id],
        mssg,
        rating
      });
    }

    await propertyReview.save();

    res.status(201).json({
      status: true,
      message: 'Review added successfully',
      review: propertyReview
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message
    });
  }
};


exports.getPropertyReviews = async (req, res) => {
    const { property_id } = req.params;
    if (!property_id) {
        return res.status(400).json({ status: false, message: "property_id is required" });
      }
      
    console.log("==>",property_id)
    try {
      let propertyReview = await PropertyReview.findOne({ property_id }).populate('buyer_id');

      console.log("===>",propertyReview)
      if (!propertyReview) {
        return res.status(404).json({
             status: false, 
             message: 'No reviews found for this property'
             });
      }
      res.status(200).json({
        status: true,
        reviews: propertyReview
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  };


  exports.updateReview = async (req, res) => {
    const { property_id, mssg, rating } = req.body;
    const buyer_id = req.user._id;
  
    try {
      const propertyReview = await PropertyReview.findOne({ property_id });
  
      if (!propertyReview){
        return res.status(404).json({ 
            status: false,
             message: 'No review found for this property'
             });
      }
  
    //   if (!propertyReview.buyer_id.includes(buyer_id)) {
    //     return res.status(403).json({ 
    //         status: false,
    //          message: 'You are not authorized to update this review'
    //          });
    //   }
  
      
      propertyReview.mssg = mssg || propertyReview.mssg;
      propertyReview.rating = rating || propertyReview.rating;
      await propertyReview.save();
  
      res.status(200).json({ status: true, message: 'Review updated successfully', review: propertyReview });
    } catch (error) {
      res.status(500).json({ status: false, error: error.message });
    }
  };
  