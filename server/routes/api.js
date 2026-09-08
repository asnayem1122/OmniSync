import express from 'express';
import { matchProviders } from '../controllers/matchController.js';
import {
  getProviders,
  getProviderById,
  getProviderSchedule,
  bookSlotForProvider,
} from '../controllers/providerController.js';
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
} from '../controllers/requestController.js';

const router = express.Router();

// Matching Endpoint
router.post('/match', matchProviders);

// Provider Endpoints
router.get('/providers', getProviders);
router.get('/providers/:id', getProviderById);
router.get('/providers/:id/schedule', getProviderSchedule);
router.post('/providers/:id/slots', bookSlotForProvider);

// Service Request Endpoints
router.post('/requests', createRequest);
router.get('/requests', getRequests);
router.get('/requests/:id', getRequestById);
router.patch('/requests/:id/status', updateRequestStatus);

export default router;
