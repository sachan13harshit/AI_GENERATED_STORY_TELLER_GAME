exports.errorHandler = (err, req, res, next) => {
    // Log error for server-side visibility
    console.error(err.stack);
  
    // Default error response
    let statusCode = 500;
    let message = 'Server Error';
    let errors = null;
  
    // Handle specific error types
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Validation Error';
      errors = Object.values(err.errors).map(val => val.message);
    }
    
    // Mongoose duplicate key error
    if (err.code === 11000) {
      statusCode = 400;
      message = 'Duplicate field value entered';
    }
    
    // Mongoose cast error (invalid ObjectId)
    if (err.name === 'CastError') {
      statusCode = 400;
      message = `Resource not found with id of ${err.value}`;
    }
    
    // JWT error
    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Invalid token';
    }
    
    // JWT expired error
    if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expired';
    }
  
    // Respond with error
    res.status(statusCode).json({
      success: false,
      message,
      errors: errors || err.message
    });
  };