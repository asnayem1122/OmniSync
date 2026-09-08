import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import apiRoutes from './routes/api.js';
import Provider from './models/Provider.js';
import { mockProviders } from './seed/seeder.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Smart Home Service Automation API',
  });
});

// Mount Routes
app.use('/api', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server and Auto-Seed if empty
const startServer = async () => {
  try {
    await connectDB();

    // Check if initial mock providers exist, otherwise auto-seed
    const count = await Provider.countDocuments();
    if (count === 0) {
      console.log('📦 Database empty. Auto-seeding initial smart home providers...');
      await Provider.insertMany(mockProviders);
      console.log(`✅ Auto-seeded ${mockProviders.length} providers.`);
    } else {
      console.log(`ℹ️ Existing providers count: ${count}`);
    }

    const server = app.listen(PORT, () => {
      console.log(`🚀 Smart Home Automation Backend running on http://localhost:${PORT}`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
