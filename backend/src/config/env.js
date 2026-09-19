import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};

// Validate critical configuration when running in production
if (ENV.NODE_ENV === 'production') {
  if (!ENV.JWT_SECRET) {
    console.error('🚨 CRITICAL CONFIG ERROR: JWT_SECRET environment variable is missing in production!');
  }
  if (!ENV.MONGO_URI) {
    console.error('🚨 CRITICAL CONFIG ERROR: MONGO_URI environment variable is missing in production!');
  }
}
