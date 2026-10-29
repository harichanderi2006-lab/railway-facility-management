const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema(
  {
    trainNumber: {
      type: String,
      required: [true, 'Train number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, 'Train name is required'],
      trim: true,
    },
    platform: {
      type: String,
      required: [true, 'Platform number is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['on-time', 'delayed', 'cancelled'],
      default: 'on-time',
    },
    arrivalTime: {
      type: String,
      required: [true, 'Arrival time is required'],
      trim: true,
    },
    departureTime: {
      type: String,
      required: [true, 'Departure time is required'],
      trim: true,
    },
    delay: {
      type: Number,
      default: 0,
      min: 0,
      comment: 'Delay in minutes',
    },
    destination: {
      type: String,
      required: [true, 'Destination station is required'],
      trim: true,
    },
    origin: {
      type: String,
      required: [true, 'Origin station is required'],
      trim: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Update updatedAt pre-save
trainSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Train = mongoose.model('Train', trainSchema);

module.exports = Train;
