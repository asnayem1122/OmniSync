import mongoose from 'mongoose';

const StatusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['Requested', 'Accepted', 'On the Way', 'In Progress', 'Completed'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
      default: '',
    },
  },
  { _id: false }
);

const MatchedProviderSummarySchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      required: true,
    },
    matchScore: {
      type: Number,
      required: true,
    },
    breakdown: {
      availability: Number,
      distance: Number,
      rating: Number,
      price: Number,
      expertise: Number,
      distanceKm: Number,
    },
  },
  { _id: false }
);

const RequestSchema = new mongoose.Schema(
  {
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
      },
      phone: {
        type: String,
        required: [true, 'Customer contact phone is required'],
      },
      email: {
        type: String,
        default: 'customer@smarthome.io',
      },
      address: {
        type: String,
        required: [true, 'Service address is required'],
      },
    },
    serviceType: {
      type: String,
      required: [true, 'Service type is required'],
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
    },
    preferredTimeRange: {
      start: {
        type: Date,
        required: [true, 'Start time is required'],
      },
      end: {
        type: Date,
        required: [true, 'End time is required'],
      },
    },
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Medium',
    },
    details: {
      type: String,
      default: 'Smart home maintenance and configuration request.',
    },
    status: {
      type: String,
      enum: ['Requested', 'Accepted', 'On the Way', 'In Progress', 'Completed'],
      default: 'Requested',
      index: true,
    },
    assignedProvider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
      default: null,
    },
    matchedProviders: [MatchedProviderSummarySchema],
    statusHistory: [StatusHistorySchema],
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to initialize status history on first creation
RequestSchema.pre('save', function (next) {
  if (this.isNew && (!this.statusHistory || this.statusHistory.length === 0)) {
    this.statusHistory = [
      {
        status: this.status || 'Requested',
        timestamp: new Date(),
        note: 'Service request initiated by customer.',
      },
    ];
  }
  next();
});

export default mongoose.model('Request', RequestSchema);
