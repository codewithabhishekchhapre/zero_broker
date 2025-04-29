const sendResponse = (res, statusCode, status, message, data = {}) => {
  return res.status(statusCode).json({ status, message, data });
};

   const handleError = (res, error, customMessage = "Something went wrong") => {
     return res.status(500).json({ status: "failed", message: customMessage, error: error.message });
   };
   
   module.exports = { sendResponse, handleError };
   