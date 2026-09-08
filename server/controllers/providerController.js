import Provider from '../models/Provider.js';

export const getProviders = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category: new RegExp(category, 'i') } : {};
    const providers = await Provider.find(query).sort({ rating: -1 });
    res.json({ success: true, count: providers.length, data: providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.json({ success: true, data: provider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProviderSchedule = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }
    res.json({
      success: true,
      providerId: provider._id,
      name: provider.name,
      bookedSlots: provider.bookedSlots,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bookSlotForProvider = async (req, res) => {
  try {
    const { id } = req.params;
    const { start, end, title, customerName } = req.body;

    const provider = await Provider.findById(id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Provider not found' });
    }

    provider.bookedSlots.push({
      start: new Date(start),
      end: new Date(end),
      title: title || 'Service Appointment',
      customerName: customerName || 'Client',
    });

    await provider.save();
    res.json({ success: true, data: provider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
