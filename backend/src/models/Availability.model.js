import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema(
  {
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
    isBooked: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const availabilitySchema = new mongoose.Schema(
  {
    panditId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pandit',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    slots: {
      type: [slotSchema],
      validate: {
        validator: function (slots) {
          return slots.length > 0;
        },
        message: 'At least one time slot is required',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index: one availability document per pandit per date
availabilitySchema.index({ panditId: 1, date: 1 }, { unique: true });

// Index for querying available slots
availabilitySchema.index({ panditId: 1, date: 1, 'slots.isBooked': 1 });

const Availability = mongoose.model('Availability', availabilitySchema);
export default Availability;
