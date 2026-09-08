import mongoose from 'mongoose';

// Disable Mongoose command buffering so queries fail immediately or fallback to mock data
// instead of hanging/timing out for 10s on Vercel when MONGO_URI is not yet configured.
mongoose.set('bufferCommands', false);

let mongoMemoryServer = null;

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const customUri = process.env.MONGO_URI;
  const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === true;
  const forceMemory = (process.env.USE_MEMORY_DB === 'true' || !customUri) && !isVercel;

  // 1. If custom MONGO_URI provided (MongoDB Atlas on Vercel or Production)
  if (customUri) {
    try {
      console.log('🔄 Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(customUri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`❌ MongoDB Atlas connection error:`, err.message);
      if (!isVercel) {
        console.log('⚡ Falling back to In-Memory MongoDB Server...');
      }
    }
  }

  // 2. Local In-Memory MongoDB (only in local standalone node, never in serverless)
  if (!isVercel || forceMemory) {
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      if (!mongoMemoryServer) {
        mongoMemoryServer = await MongoMemoryServer.create();
      }
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ Connected to In-Memory MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error('❌ In-Memory MongoDB notice:', err.message);
    }
  }

  console.log('ℹ️ Running in resilient Zero-Config Mode with in-memory store.');
  return null;
};

export const closeDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    await mongoose.disconnect();
  }
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
    mongoMemoryServer = null;
  }
};
