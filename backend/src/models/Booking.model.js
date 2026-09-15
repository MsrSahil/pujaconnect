import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    panditId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pandit',
      required: true,
    },
    pujaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Puja',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Booking date is required'],
    },
    timeSlot: {
      startTime: {
        type: String,
        required: [true, 'Start time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:MM format'],
      },
      endTime: {
        type: String,
        required: [true, 'End time is required'],
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:MM format'],
      },
    },
    locationType: {
      type: String,
      enum: {
        values: ['home', 'temple'],
        message: '{VALUE} is not a valid location type for booking',
      },
      required: [true, 'Location type is required'],
    },
    address: {
      type: String,
      trim: true,
      maxlength: [500, 'Address cannot exceed 500 characters'],
      // Required only if locationType is 'home' — validated in service layer
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        message: '{VALUE} is not a valid booking status',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true, // provides createdAt
  }
);

// Indexes for common queries
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ panditId: 1, status: 1 });
bookingSchema.index({ date: 1 });
bookingSchema.index({ createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
