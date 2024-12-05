class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (err.name === 'ValidationError') {
        err.statusCode = 400;
    } else if (err.code === 11000) {
        err.statusCode = 400;
        err.message = 'Duplicate field value';
    } else if (err.name === 'CastError') {
        err.statusCode = 400;
        err.message = 'Invalid ID format';
    } else if (err.name === 'JsonWebTokenError') {
        err.statusCode = 401;
        err.message = 'Invalid token';
    }

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
        error: process.env.NODE_ENV === 'development' ? err : undefined
    });
};

module.exports = { AppError, errorHandler };