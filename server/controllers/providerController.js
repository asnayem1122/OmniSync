import mongoose from 'mongoose';
import Provider from '../models/Provider.js';
import { mockProviders } from '../seed/seeder.js';

// In-memory runtime cache for serverless mode
let inMemoryProviders = mockProviders.map((p, i) => ({
  ...p,
  _id: p._id || `prov_${i + 1}`,
}));

export const getProviders = async (req, res) => {
  try {
    const { category } = req.query;

    if (mongoose.connection.readyState >= 1) {
      const query = category ? { category: new RegExp(category, 'i') } : {};
      const providers = await Provider.find(query).sort({ rating: -1 });
      return res.json({ success: true, count: providers.length, data: providers });
    }

    // In-memory fallback
    let filtered = inMemoryProviders;
    if (category) {
      filtered = filtered.filter((p) =>
        p.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    return res.json({ success: true, count: filtered.length, data: filtered });
  } catch (error) {
    console.warn('Provider query fallback:', error.message);
    return res.json({ success: true, count: inMemoryProviders.length, data: inMemoryProviders });
  }
};

export const getProviderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState >= 1) {
      const provider = await Provider.findById(id);
      if (provider) return res.json({ success: true, data: provider });
    }

    const provider = inMemoryProviders.find((p) => String(p._id) === String(id));
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    return res.json({ success: true, data: provider });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProviderSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState >= 1) {
      const provider = await Provider.findById(id);
      if (provider) {
        return res.json({
          success: true,
          providerId: provider._id,
          name: provider.name,
          bookedSlots: provider.bookedSlots,
        });
      }
    }

    const provider = inMemoryProviders.find((p) => String(p._id) === String(id));
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    return res.json({
      success: true,
      providerId: provider._id,
      name: provider.name,
      bookedSlots: provider.bookedSlots || [],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const bookSlotForProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end, title, customerName } = req.body;

    const newSlot = {
      start: new Date(start),
      end: new Date(end),
      title: title || 'Service Appointment',
      customerName: customerName || 'Client',
    };

    if (mongoose.connection.readyState >= 1) {
      const provider = await Provider.findById(id);
      if (provider) {
        provider.bookedSlots.push(newSlot);
        await provider.save();
        return res.json({ success: true, data: provider });
      }
    }

    const provider = inMemoryProviders.find((p) => String(p._id) === String(id));
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    provider.bookedSlots = provider.bookedSlots || [];
    provider.bookedSlots.push(newSlot);
    return res.json({ success: true, data: provider });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
