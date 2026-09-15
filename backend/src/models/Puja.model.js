import mongoose from 'mongoose';

const pujaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Puja name is required'],
      trim: true,
      maxlength: [150, 'Puja name cannot exceed 150 characters'],
    },
    description: {
      type: String,
      required: [true, 'Puja description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [15, 'Duration must be at least 15 minutes'],
      max: [480, 'Duration cannot exceed 8 hours'],
    },
    requiredMaterials: {
      type: [String],
      default: [],
    },
    priceRange: {
      min: {
        type: Number,
        required: [true, 'Minimum price is required'],
        min: [0, 'Price cannot be negative'],
      },
      max: {
        type: Number,
        required: [true, 'Maximum price is required'],
        min: [0, 'Price cannot be negative'],
      },
    },
    locationType: {
      type: String,
      enum: {
        values: ['home', 'temple', 'both'],
        message: '{VALUE} is not a valid location type',
      },
      required: [true, 'Location type is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: [100, 'Category cannot exceed 100 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Validate that priceRange.max >= priceRange.min
pujaSchema.pre('validate', function (next) {
  if (
    this.priceRange &&
    this.priceRange.min != null &&
    this.priceRange.max != null &&
    this.priceRange.max < this.priceRange.min
  ) {
    this.invalidate(
      'priceRange.max',
      'Maximum price must be greater than or equal to minimum price'
    );
  }
  next();
});

// Index for common queries
pujaSchema.index({ category: 1 });
pujaSchema.index({ name: 'text', description: 'text' });

const Puja = mongoose.model('Puja', pujaSchema);
export default Puja;
