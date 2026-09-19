import mongoose from 'mongoose';
import { ENV } from './env.js';

const connectDB = async () => {
  try {
    // Removed mongoose.set('sanitizeFilter', true) because it conflicts with backend queries.
    // NoSQL injection is already handled by express-mongo-sanitize in app.js

    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
