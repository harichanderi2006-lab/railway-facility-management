const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Alert type is required'],
      enum: {
        values: ['emergency', 'info', 'warning'],
        message: '{VALUE} is not a valid alert type',
      },
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Alert message is required'],
      trim: true,
    },
    area: {
      type: String,
      required: [true, 'Area is required'],
      trim: true,
      default: 'Station-Wide',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ isActive: 1, createdAt: -1 });

const Alert = mongoose.model('Alert', alertSchema);

module.exports = Alert;
