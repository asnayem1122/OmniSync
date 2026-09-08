import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const customUri = process.env.MONGO_URI;
  const forceMemory = process.env.USE_MEMORY_DB === 'true' || !customUri;

  if (forceMemory) {
    try {
      console.log('⚡ Initializing Embedded In-Memory MongoDB Server...');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ Connected to In-Memory MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error('❌ Failed to initialize In-Memory MongoDB:', err.message);
      if (customUri) {
        console.log('🔄 Falling back to MONGO_URI...');
      } else {
        throw err;
      }
    }
  }

  if (customUri) {
    try {
      const conn = await mongoose.connect(customUri);
      console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.error(`❌ MongoDB connection error (${customUri}):`, err.message);
      console.log('⚡ Falling back to In-Memory MongoDB Server...');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`✅ Connected to Fallback In-Memory MongoDB: ${conn.connection.host}`);
      return conn;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
