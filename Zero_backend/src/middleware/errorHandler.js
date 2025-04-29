class ApiError extends Error {
     constructor(statusCode, message, errors = null) {
         super(message);
         this.statusCode = statusCode;
         this.errors = errors; // Detailed field validation errors
     }
 }
 
 const errorHandler = (err, req, res, next) => {
     console.error("Error Occurred:", err);
 
     let statusCode = err.statusCode || 500;
     let message = err.message || "Internal Server Error";
 
     // Handle Mongoose validation errors
     if (err.name === "ValidationError") {
         statusCode = 400;
         message = "Validation Failed";
         const validationErrors = {};
         
         Object.keys(err.errors).forEach((key) => {
             validationErrors[key] = err.errors[key].message;
         });
 
         return res.status(statusCode).json({
             success: false,
             message,
             errors: validationErrors,
         });
     }
 
     // Handle MongoDB Cast Errors (Wrong data type)
     if (err.name === "CastError") {
         statusCode = 400;
         message = `Invalid value for field: ${err.path}`;
         return res.status(statusCode).json({ success: false, message });
     }
 
     // Handle Missing Required Fields
     if (err instanceof ApiError) {
         return res.status(statusCode).json({
             success: false,
             message: err.message,
             errors: err.errors || null,
         });
     }
 
     // Default error response
     res.status(statusCode).json({ success: false, message });
 };
 
 module.exports = { ApiError, errorHandler };
 