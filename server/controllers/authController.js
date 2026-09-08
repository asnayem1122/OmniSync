import Provider from '../models/Provider.js';
import mongoose from 'mongoose';

// In-memory registered customers
let registeredCustomers = [
  {
    id: 'cust_1',
    name: 'Alex Rivera',
    email: 'alex.rivera@homemail.com',
    phone: '+1 (512) 555-4829',
    address: '600 Congress Ave, Austin, TX',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'cust_2',
    name: 'Elena Rostova',
    email: 'elena.rostova@techfacilities.io',
    phone: '+1 (512) 555-9081',
    address: '11410 Century Oaks, Austin, TX',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
];

export const loginUser = async (req, res) => {
  try {
    const { email, role, providerId, name } = req.body;

    // Service Holder Login
    if (role === 'provider') {
      let provider = null;
      if (providerId && mongoose.connection.readyState >= 1) {
        provider = await Provider.findById(providerId);
      } else if (email && mongoose.connection.readyState >= 1) {
        provider = await Provider.findOne({ phone: new RegExp(email, 'i') });
      }

      if (!provider && mongoose.connection.readyState >= 1) {
        // Fallback to first provider if none specific
        provider = await Provider.findOne();
      }

      if (provider) {
        return res.json({
          success: true,
          message: `Logged in as Service Specialist: ${provider.name}`,
          user: {
            id: provider._id,
            providerId: provider._id,
            name: provider.name,
            email: `${provider.name.toLowerCase().replace(/\s+/g, '.')}@omnisync-tech.com`,
            role: 'provider',
            avatar: provider.avatar,
            category: provider.category,
            phone: provider.phone,
            rating: provider.rating,
            reviewsCount: provider.reviewsCount,
            expertiseLevel: provider.expertiseLevel,
            earnings: provider.earnings || 1480,
            isAvailable: provider.isAvailable ?? true,
          },
        });
      }

      // Mock provider fallback
      return res.json({
        success: true,
        message: 'Logged in as Service Specialist (Demo)',
        user: {
          id: providerId || 'prov_1',
          providerId: providerId || 'prov_1',
          name: name || 'Marcus Vance',
          email: email || 'marcus.vance@omnisync-tech.com',
          role: 'provider',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          category: 'Smart Lighting & Control',
          phone: '+1 (512) 555-0192',
          rating: 4.9,
          reviewsCount: 38,
          expertiseLevel: 'Master',
          earnings: 2450,
          isAvailable: true,
        },
      });
    }

    // Customer Login
    let customer = registeredCustomers.find(
      (c) => c.email.toLowerCase() === (email || '').toLowerCase()
    );

    if (!customer) {
      // Create guest customer session or match by name
      customer = {
        id: `cust_${Date.now()}`,
        name: name || 'Alex Rivera',
        email: email || 'alex.rivera@homemail.com',
        phone: '+1 (512) 555-4829',
        address: '600 Congress Ave, Austin, TX',
        role: 'customer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      };
      registeredCustomers.push(customer);
    }

    return res.json({
      success: true,
      message: `Welcome back, ${customer.name}!`,
      user: customer,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const registerCustomer = async (req, res) => {
  try {
    const { name, email, phone, address, password } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    const existing = registeredCustomers.find(
      (c) => c.email.toLowerCase() === email.toLowerCase()
    );
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const newCustomer = {
      id: `cust_${Date.now()}`,
      name,
      email,
      phone: phone || '+1 (512) 555-0000',
      address: address || 'Austin, TX',
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    };

    registeredCustomers.push(newCustomer);

    return res.status(201).json({
      success: true,
      message: 'Customer account registered successfully',
      user: newCustomer,
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleProviderAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable } = req.body;

    if (mongoose.connection.readyState >= 1) {
      const provider = await Provider.findById(id);
      if (provider) {
        provider.isAvailable = typeof isAvailable === 'boolean' ? isAvailable : !provider.isAvailable;
        await provider.save();
        return res.json({ success: true, isAvailable: provider.isAvailable, data: provider });
      }
    }

    return res.json({ success: true, isAvailable: !!isAvailable });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
