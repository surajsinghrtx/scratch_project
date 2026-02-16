// utils/dbHelpers.js
const mongoose = require('mongoose');

const waitForDB = async (timeout = 5000) => {
    const startTime = Date.now();
    
    while (mongoose.connection.readyState !== 1) {
        if (Date.now() - startTime > timeout) {
            throw new Error('Database connection timeout');
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    return true;
};

module.exports = { waitForDB };