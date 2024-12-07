class AppError extends Error {
    constructor(message, statusCode, errorCode = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.errorCode = errorCode;
        this.isOperational = true; // To distinguish operational errors from programming errors
        Error.captureStackTrace(this, this.constructor);
    }
}

const handleMongoValidationError = (err) => {
    const errors = Object.values(err.errors).map(error => error.message);
    return new AppError(
        `Invalid input: ${errors.join('. ')}`,
        400,
        'VALIDATION_ERROR'
    );
};

const handleDuplicateKeyError = (err) => {
    const field = Object.keys(err.keyValue)[0];
    return new AppError(
        `Duplicate value for field: ${field}`,
        400,
        'DUPLICATE_FIELD'
    );
};

const handleCastError = (err) => {
    return new AppError(
        `Invalid ${err.path}: ${err.value}`,
        400,
        'INVALID_ID'
    );
};

const handleJWTError = () => {
    return new AppError(
        'Invalid authentication token',
        401,
        'INVALID_TOKEN'
    );
};

const handleJWTExpiredError = () => {
    return new AppError(
        'Your authentication token has expired',
        401,
        'EXPIRED_TOKEN'
    );
};

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        errorCode: err.errorCode,
        stack: err.stack,
        error: err
    });
};

const sendErrorProd = (err, res) => {
    // Operational, trusted errors: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            errorCode: err.errorCode
        });
    } else {
        // Programming or unknown errors: don't leak error details
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
            errorCode: 'INTERNAL_ERROR'
        });
    }
};

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        if (err.name === 'ValidationError') error = handleMongoValidationError(err);
        if (err.code === 11000) error = handleDuplicateKeyError(err);
        if (err.name === 'CastError') error = handleCastError(err);
        if (err.name === 'JsonWebTokenError') error = handleJWTError();
        if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};

// Error utility functions
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = { 
    AppError, 
    errorHandler,
    catchAsync 
};