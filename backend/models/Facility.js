const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Facility name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Facility type is required'],
      enum: {
        values: ['toilet', 'atm', 'food', 'waiting', 'medical', 'wheelchair', 'elevator', 'ticket'],
        message: '{VALUE} is not a valid facility type',
      },
      lowercase: true,
      trim: true,
    },
    floor: {
      type: Number,
      required: [true, 'Floor number is required (0 for Ground, 1 for First Floor, etc.)'],
      default: 0,
    },
    location: {
      x: {
        type: Number,
        required: [true, 'X coordinate on station map is required'],
      },
      y: {
        type: Number,
        required: [true, 'Y coordinate on station map is required'],
      },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    crowdLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    isAccessible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for location and type queries
facilitySchema.index({ type: 1, floor: 1 });
facilitySchema.index({ 'location.x': 1, 'location.y': 1 });

const Facility = mongoose.model('Facility', facilitySchema);

module.exports = Facility;
