module.exports = {
    PORT: parseInt(process.env.PORT) || 5000,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '30d'
};