// middlewares/checkDbConnection.js
const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.log('⚠️ Database not ready. State:', mongoose.connection.readyState);
    // States: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    
    if (mongoose.connection.readyState === 0) {
      return res.status(503).json({ 
        error: 'Database connection unavailable. Please try again in a few seconds.' 
      });
    }
    
    // If connecting, wait a bit
    if (mongoose.connection.readyState === 2) {
      return setTimeout(() => next(), 1000);
    }
  }
  next();
};