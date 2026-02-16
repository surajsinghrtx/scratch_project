// const mongoose=require('mongoose');
// //npm i debug=>to write
// // and also set value DEBUG=development:*

// const dbgr=require('debug')("development:mongoose")
// const config=require('config');

// //config automatically works on the basis of envrionment variable
// mongoose.connect(`${config.get("MONGODB_URI")}/scratch`)   //use config so require config and npm i config
// .then(()=>{
//     dbgr("connected");

// })
// .catch((err)=>{
//   dbgr(err);
// })

// module.exports=mongoose.connection;


// const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// module.exports = mongoose.connection;








// const mongoose = require("mongoose");

// // Get connection string
// const mongoURI = process.env.MONGO_URI;

// if (!mongoURI) {
//   console.error("❌ FATAL ERROR: MONGO_URI is not defined in environment variables!");
//   console.error("Current environment variables:", Object.keys(process.env));
//   process.exit(1);
// }

// console.log("🔄 Connecting to MongoDB...");

// // Connection options optimized for Render
// const connectDB = async () => {
//   try {
//     await mongoose.connect(mongoURI, {
//       serverSelectionTimeoutMS: 30000,
//       socketTimeoutMS: 45000,
//       connectTimeoutMS: 30000,
//       maxPoolSize: 10,
//       minPoolSize: 2,
//       retryWrites: true,
//       retryReads: true,
//     });
    
//     console.log("✅ MongoDB connected successfully!");
//     console.log("Database:", mongoose.connection.name);
//     console.log("Host:", mongoose.connection.host);
    
//     // Handle connection events
//     mongoose.connection.on('error', (err) => {
//       console.error('❌ MongoDB connection error:', err);
//     });
    
//     mongoose.connection.on('disconnected', () => {
//       console.log('⚠️ MongoDB disconnected - attempting to reconnect...');
//     });
    
//     mongoose.connection.on('reconnected', () => {
//       console.log('✅ MongoDB reconnected');
//     });
    
//     return mongoose.connection;
    
//   } catch (error) {
//     console.error('❌ MongoDB connection failed:', error.message);
//     console.log('Retrying in 5 seconds...');
//     setTimeout(connectDB, 5000);
//   }
// };

// // Execute connection
// connectDB();

// module.exports = mongoose.connection;








const mongoose = require("mongoose");
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("❌ MONGO_URI is not defined!");
  process.exit(1);
}

console.log("🔄 Connecting to MongoDB...");

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      retryReads: true,
    });
    
    console.log("✅ MongoDB connected successfully!");
    console.log("Database:", mongoose.connection.name);
    console.log("Host:", mongoose.connection.host);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Event listeners
mongoose.connection.on('connected', () => {
  console.log('✅ DATABASE CONNECTED - Ready to handle requests');
});

mongoose.connection.on('connecting', () => {
  console.log('⏳ Database connecting...');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Database disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Database error:', err);
});

// Start connection
connectDB();

module.exports = mongoose.connection;