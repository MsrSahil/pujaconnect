import mongoose from 'mongoose';

const panditSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    location: {
      city: {
        type: String,
        trim: true,
        default: '',
      },
      state: {
        type: String,
        trim: true,
        default: '',
      },
    },
    experienceYears: {
      type: Number,
      default: 0,
      min: [0, 'Experience cannot be negative'],
      max: [80, 'Experience seems unrealistic'],
    },
    languagesSpoken: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [1000, 'Bio cannot exceed 1000 characters'],
      default: '',
    },
    photoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    supportedRituals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Puja',
      },
    ],
    verificationStatus: {
      type: String,
      enum: {
        values: ['pending', 'verified', 'rejected'],
        message: '{VALUE} is not a valid verification status',
      },
      default: 'pending',
    },
    ratingsEnabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for common query patterns
panditSchema.index({ 'location.city': 1 });
panditSchema.index({ verificationStatus: 1 });
panditSchema.index({ experienceYears: -1 });

const Pandit = mongoose.model('Pandit', panditSchema);
export default Pandit;
