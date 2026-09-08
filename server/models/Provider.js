import mongoose from 'mongoose';

const BookedSlotSchema = new mongoose.Schema(
  {
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    title: {
      type: String,
      default: 'Booked Appointment',
    },
    customerName: {
      type: String,
      default: 'Client',
    },
  },
  { _id: true }
);

const ProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Provider name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Service category is required'],
      index: true,
    },
    location: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        default: 'Metropolis',
      },
    },
    rating: {
      type: Number,
      min: 1.0,
      max: 5.0,
      default: 4.5,
      index: true,
    },
    reviewsCount: {
      type: Number,
      default: 24,
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price rate is required'],
      min: 20,
    },
    expertiseLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert', 'Master'],
      default: 'Expert',
    },
    bookedSlots: [BookedSlotSchema],
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    phone: {
      type: String,
      default: '+1 (555) 234-5678',
    },
    bio: {
      type: String,
      default: 'Experienced smart home specialist certified in multi-protocol IoT ecosystems.',
    },
    badges: {
      type: [String],
      default: ['Verified Pro', 'Fast Responder'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    earnings: {
      type: Number,
      default: 1480,
    },
    completedJobsCount: {
      type: Number,
      default: 18,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Provider', ProviderSchema);
