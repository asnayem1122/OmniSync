import mongoose from 'mongoose';

let mongoMemoryServer = null;

export const connectDB = async () => {
  // Reuse existing connection in serverless / hot-reload environments
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const customUri = process.env.MONGO_URI;
  const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === true;
  const forceMemory = (process.env.USE_MEMORY_DB === 'true' || !customUri) && !isVercel;

  // 1. If explicit MONGO_URI provided (e.g. MongoDB Atlas on Vercel or Production)
  if (customUri) {
    try {
      console.log('🔄 Connecting to MongoDB (Atlas / Remote)...');
      const conn = await mongoose.connect(customUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`❌ MongoDB connection error (${customUri}):`, err.message);
      if (!isVercel) {
        console.log('⚡ Falling back to In-Memory MongoDB Server...');
      } else {
        throw err;
      }
    }
  }

  // 2. Local / Development In-Memory MongoDB Server
  if (!isVercel || forceMemory) {
    try {
      console.log('⚡ Initializing Embedded In-Memory MongoDB Server...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      if (!mongoMemoryServer) {
        mongoMemoryServer = await MongoMemoryServer.create();
      }
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ Connected to In-Memory MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error('❌ Failed to initialize In-Memory MongoDB:', err.message);
      if (customUri) {
        return await mongoose.connect(customUri);
      }
      throw err;
    }
  }

  // 3. Fallback on Vercel if no MONGO_URI was provided
  console.warn('⚠️ Running on Vercel without MONGO_URI environment variable.');
  console.warn('👉 Please set MONGO_URI in your Vercel Project Settings for MongoDB Atlas persistence.');
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
