// middleware/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  try {
    let error = { ...err };

    error.message = err.message;
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

  // Handle specific error types
    if (err instanceof SyntaxError && 'body' in err) {
      statusCode = 400;
      message = 'Invalid JSON payload';
  }

  // Log the error (optional)
  console.error(`[${new Date().toISOString()}] ${err.stack || message}`);


    // Get Error Type
    if (err.name === "CastError") {
      const message = "Resource not found";
      error = new Error(message);
      error.statusCode = 404;
    }

    if (err.message === "User not found") {
      error.statusCode = 404;
      error.message = err.message;
    }

    if (err.message === "Invalid credentials") {
      error.statusCode = 400;
      error.message = err.message;
    }
 
    if (err.name === 'ValidationError') {
      error.message = Object.values(err.errors).map(val => (val as any).message);
      error.statusCode = 400;
    }
    
    if (err.code === 11000) {
      error.message = 'Duplicate field value entered';
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({ 
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode || 500,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
      }
    });    
  } catch (error) {
    next(error);
  }   
};
  
export default errorHandler;