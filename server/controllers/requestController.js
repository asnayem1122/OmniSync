import mongoose from 'mongoose';
import Request from '../models/Request.js';
import Provider from '../models/Provider.js';
import { mockProviders } from '../seed/seeder.js';

// In-memory requests store for serverless demo mode
let inMemoryRequests = [];

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

    if (mongoose.connection.readyState >= 1) {
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
      return res.status(201).json({
        success: true,
        message: 'Service request created successfully',
        data: populated,
      });
    }

    // In-memory fallback
    const assigned = mockProviders.find((p) => String(p._id) === String(assignedProvider)) || null;
    const inMemReq = {
      _id: `req_${Date.now()}`,
      customer,
      serviceType,
      location,
      preferredTimeRange: {
        start: new Date(preferredTimeRange.start),
        end: new Date(preferredTimeRange.end),
      },
      urgency,
      details: details || `Smart home service for ${serviceType}`,
      assignedProvider: assigned,
      matchedProviders,
      status: assigned ? 'Accepted' : 'Requested',
      statusHistory: [
        {
          status: assigned ? 'Accepted' : 'Requested',
          timestamp: new Date(),
          note: 'Service request initiated by customer.',
        },
      ],
      createdAt: new Date(),
    };

    inMemoryRequests.unshift(inMemReq);

    return res.status(201).json({
      success: true,
      message: 'Service request created successfully (in-memory mode)',
      data: inMemReq,
    });
  } catch (error) {
    console.error('Error creating request:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const { status, providerId, limit = 50 } = req.query;

    if (mongoose.connection.readyState >= 1) {
      const filter = {};
      if (status) filter.status = status;
      if (providerId) {
        filter.$or = [{ assignedProvider: providerId }, { status: 'Requested' }];
      }

      const requests = await Request.find(filter)
        .populate('assignedProvider')
        .sort({ createdAt: -1 })
        .limit(Number(limit));

      return res.json({ success: true, count: requests.length, data: requests });
    }

    // In-memory fallback
    let list = inMemoryRequests;
    if (status) list = list.filter((r) => r.status === status);
    if (providerId) {
      list = list.filter(
        (r) => String(r.assignedProvider?._id) === String(providerId) || r.status === 'Requested'
      );
    }
    return res.json({ success: true, count: list.length, data: list.slice(0, Number(limit)) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState >= 1) {
      const request = await Request.findById(id).populate('assignedProvider');
      if (request) return res.json({ success: true, data: request });
    }

    const reqObj = inMemoryRequests.find((r) => String(r._id) === String(id));
    if (!reqObj) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    return res.json({ success: true, data: reqObj });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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

    if (mongoose.connection.readyState >= 1) {
      const request = await Request.findById(id);
      if (!request) {
        return res.status(404).json({ success: false, message: 'Request not found' });
      }

      request.status = status;
      if (providerId && !request.assignedProvider) {
        request.assignedProvider = providerId;
        const provider = await Provider.findById(providerId);
        if (provider) {
          provider.bookedSlots.push({
            start: request.preferredTimeRange.start,
            end: request.preferredTimeRange.end,
            title: `${request.serviceType} - ${request.customer.name}`,
            customerName: request.customer.name,
          });
          await provider.save();
        }
      }

      request.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Status transitioned to ${status}`,
      });

      await request.save();
      const updated = await Request.findById(id).populate('assignedProvider');
      return res.json({
        success: true,
        message: `Request status successfully updated to ${status}`,
        data: updated,
      });
    }

    // In-memory fallback
    const reqObj = inMemoryRequests.find((r) => String(r._id) === String(id));
    if (!reqObj) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    reqObj.status = status;
    if (providerId && !reqObj.assignedProvider) {
      const prov = mockProviders.find((p) => String(p._id) === String(providerId));
      if (prov) reqObj.assignedProvider = prov;
    }
    reqObj.statusHistory.push({
      status,
      timestamp: new Date(),
      note: note || `Status transitioned to ${status}`,
    });

    return res.json({
      success: true,
      message: `Request status successfully updated to ${status}`,
      data: reqObj,
    });
  } catch (error) {
    console.error('Error updating status:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
