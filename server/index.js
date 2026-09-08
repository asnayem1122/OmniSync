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

// Middlewares - Open CORS for Vercel cross-origin frontend support
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Serverless DB Middleware: Ensure DB is connected & seeded before handling requests
app.use(async (req, res, next) => {
  try {
    const conn = await connectDB();

    // Auto-seed if running on empty collection and DB is available
    if (conn && req.path !== '/' && req.path !== '/health' && req.path !== '/api/health') {
      const count = await Provider.countDocuments();
      if (count === 0) {
        console.log('📦 Auto-seeding initial smart home providers...');
        await Provider.insertMany(mockProviders);
      }
    }
  } catch (err) {
    console.error('Database middleware notice:', err.message);
  }
  next();
});

// Root & Health Checks
app.get(['/', '/health', '/api/health'], (req, res) => {
  res.json({
    status: 'online',
    environment: isVercel ? 'vercel-serverless' : 'standalone-node',
    timestamp: new Date().toISOString(),
    service: 'Smart Home Service Automation API',
    endpoints: {
      match: '/api/match',
      providers: '/api/providers',
      requests: '/api/requests',
    },
  });
});

// Mount Routes on both '/api' and '/' for flexible Vercel routing
app.use('/api', apiRoutes);
app.use('/', apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Only listen on a TCP port if running standalone (not on Vercel)
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
