import app from './app.js';
import connectDB from './config/db.js';
import { ENV } from './config/env.js';

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  const PORT = ENV.PORT;

  app.listen(PORT, () => {
    console.log(`🚀 PujaConnect server running on port ${PORT} [${ENV.NODE_ENV}]`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/v1/health`);
  });
};

startServer();
