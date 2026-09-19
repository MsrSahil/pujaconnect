import mongoose from 'mongoose';
import { ENV } from './env.js';

const connectDB = async () => {
  try {
    // Enable Mongoose sanitizeFilter to prevent NoSQL query selector injection
    mongoose.set('sanitizeFilter', true);

    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
