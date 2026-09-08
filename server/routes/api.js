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
  submitRequestReview,
} from '../controllers/requestController.js';
import {
  loginUser,
  registerCustomer,
  toggleProviderAvailability,
} from '../controllers/authController.js';

const router = express.Router();

// Auth Endpoints
router.post('/auth/login', loginUser);
router.post('/auth/register', registerCustomer);

// Matching Endpoint
router.post('/match', matchProviders);

// Provider Endpoints
router.get('/providers', getProviders);
router.get('/providers/:id', getProviderById);
router.get('/providers/:id/schedule', getProviderSchedule);
router.post('/providers/:id/slots', bookSlotForProvider);
router.patch('/providers/:id/availability', toggleProviderAvailability);

// Service Request Endpoints
router.post('/requests', createRequest);
router.get('/requests', getRequests);
router.get('/requests/:id', getRequestById);
router.patch('/requests/:id/status', updateRequestStatus);
router.post('/requests/:id/review', submitRequestReview);

export default router;
