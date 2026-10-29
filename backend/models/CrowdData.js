const mongoose = require('mongoose');

const crowdDataSchema = new mongoose.Schema(
  {
    area: {
      type: String,
      required: [true, 'Area name is required'],
      trim: true,
    },
    crowdLevel: {
      type: String,
      enum: {
        values: ['low', 'medium', 'high'],
        message: '{VALUE} is not a valid crowd level (low, medium, high)',
      },
      required: [true, 'Crowd level is required'],
      lowercase: true,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

crowdDataSchema.index({ area: 1, timestamp: -1 });

const CrowdData = mongoose.model('CrowdData', crowdDataSchema);

module.exports = CrowdData;
