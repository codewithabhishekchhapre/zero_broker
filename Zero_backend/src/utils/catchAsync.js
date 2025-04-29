// utils/catchAsync.js
module.exports = (fn) => (req, res, next) => {
     Promise.resolve(fn(req, res, next)).catch((err) => {
       const { sendResponse } = require("./responseHandler");
       return sendResponse(res, 500, "failed", err.message || "Server Error");
     });
   };
   