"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    try {
        let error = Object.assign({}, err);
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
        if (err.message === "User is unverified") {
            error.statusCode = 401;
            error.message = err.message;
        }
        if (err.message === "Invalid credentials") {
            error.statusCode = 400;
            error.message = err.message;
        }
        if (err.name === 'ValidationError') {
            error.message = Object.values(err.errors).map(val => val.message);
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
    }
    catch (error) {
        next(error);
    }
};
exports.errorHandler = errorHandler;
exports.default = exports.errorHandler;
//# sourceMappingURL=error.middleware.js.map