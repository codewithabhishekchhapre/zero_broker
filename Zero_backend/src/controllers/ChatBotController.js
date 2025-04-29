
const FAQ=require("../models/Faq")
const Chat= async (req, res) => {
    try {
      const { question } = req.body;
  
      const faq = await FAQ.findOne({ question: { $regex: question, $options: "i" } });
  
      if (faq) {
        return res.json({
            
            status:"success",
            message: "answer get successfully",
             answer: faq.answer

             });
      } else {
        return res.json ({

               status:"false",
              response: "Sorry, I don't have an answer for that." });
      }
    } catch (error) {
        
        console.log(error)
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  module.exports=Chat