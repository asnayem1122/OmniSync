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
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL === true;

// Middlewares
app.use(cors());
app.use(express.json());

// Serverless DB Middleware: Ensure DB is connected & seeded before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB();

    // Auto-seed if running on empty collection (e.g. first run or in-memory)
    if (req.path.startsWith('/api') && req.path !== '/api/health') {
      const count = await Provider.countDocuments();
      if (count === 0) {
        console.log('📦 Auto-seeding initial smart home providers...');
        await Provider.insertMany(mockProviders);
      }
    }
  } catch (err) {
    console.error('Database connection / seeding notice:', err.message);
  }
  next();
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    environment: isVercel ? 'vercel-serverless' : 'standalone-node',
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

// Only listen on TCP port if not running in a serverless environment (like Vercel)
if (!isVercel) {
  const startServer = async () => {
    try {
      await connectDB();
      const count = await Provider.countDocuments();
      if (count === 0) {
        console.log('📦 Database empty. Auto-seeding initial smart home providers...');
        await Provider.insertMany(mockProviders);
        console.log(`✅ Auto-seeded ${mockProviders.length} providers.`);
      } else {
        console.log(`ℹ️ Existing providers count: ${count}`);
      }

      app.listen(PORT, () => {
        console.log(`🚀 Smart Home Automation Backend running on http://localhost:${PORT}`);
        console.log(`📡 API Base: http://localhost:${PORT}/api`);
      });
    } catch (error) {
      console.error('Failed to start standalone server:', error);
      process.exit(1);
    }
  };

  startServer();
}

export default app;
