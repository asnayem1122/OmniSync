import Request from '../models/Request.js';
import Provider from '../models/Provider.js';

export const createRequest = async (req, res) => {
  try {
    const {
      customer,
      serviceType,
      location,
      preferredTimeRange,
      urgency = 'Medium',
      details,
      assignedProvider,
      matchedProviders = [],
    } = req.body;

    if (!customer || !customer.name || !customer.phone) {
      return res.status(400).json({ success: false, message: 'Customer name and phone are required' });
    }

    if (!serviceType || !location || !preferredTimeRange) {
      return res.status(400).json({ success: false, message: 'Service type, location, and time are required' });
    }

    const newRequest = new Request({
      customer,
      serviceType,
      location,
      preferredTimeRange: {
        start: new Date(preferredTimeRange.start),
        end: new Date(preferredTimeRange.end),
      },
      urgency,
      details: details || `Smart home service for ${serviceType}`,
      assignedProvider: assignedProvider || null,
      matchedProviders,
      status: assignedProvider ? 'Accepted' : 'Requested',
    });

    await newRequest.save();

    // If a provider was already assigned on creation, block their slot
    if (assignedProvider) {
      const provider = await Provider.findById(assignedProvider);
      if (provider) {
        provider.bookedSlots.push({
          start: newRequest.preferredTimeRange.start,
          end: newRequest.preferredTimeRange.end,
          title: `${serviceType} - ${customer.name}`,
          customerName: customer.name,
        });
        await provider.save();
      }
    }

    const populated = await Request.findById(newRequest._id).populate('assignedProvider');

    res.status(201).json({
      success: true,
      message: 'Service request created successfully',
      data: populated,
    });
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const { status, providerId, limit = 50 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (providerId) {
      // Either assigned or available in queue
      filter.$or = [{ assignedProvider: providerId }, { status: 'Requested' }];
    }

    const requests = await Request.find(filter)
      .populate('assignedProvider')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate('assignedProvider');
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, providerId, note } = req.body;

    const validStatuses = ['Requested', 'Accepted', 'On the Way', 'In Progress', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const request = await Request.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    request.status = status;

    if (providerId && !request.assignedProvider) {
      request.assignedProvider = providerId;
      // Add booked slot to provider if accepting
      const provider = await Provider.findById(providerId);
      if (provider) {
        const slotExists = provider.bookedSlots.some(
          (s) =>
            new Date(s.start).getTime() === new Date(request.preferredTimeRange.start).getTime() &&
            new Date(s.end).getTime() === new Date(request.preferredTimeRange.end).getTime()
        );
        if (!slotExists) {
          provider.bookedSlots.push({
            start: request.preferredTimeRange.start,
            end: request.preferredTimeRange.end,
            title: `${request.serviceType} - ${request.customer.name}`,
            customerName: request.customer.name,
          });
          await provider.save();
        }
      }
    }

    request.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status transitioned to ${status}`,
    });

    await request.save();
    const updated = await Request.findById(id).populate('assignedProvider');

    res.json({
      success: true,
      message: `Request status successfully updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
