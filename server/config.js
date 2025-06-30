require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI,
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
};
