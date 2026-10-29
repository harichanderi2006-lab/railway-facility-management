const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Item description is required'],
      trim: true,
    },
    foundAt: {
      type: String,
      required: [true, 'Location where item was found/lost is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Electronics',
          'Documents & Cards',
          'Bags & Luggage',
          'Clothing & Accessories',
          'Keys & Wallets',
          'Accessibility Equipment',
          'Medical & Glasses',
          'Other',
        ],
        message: '{VALUE} is not a supported category',
      },
      trim: true,
      default: 'Other',
    },
    contactInfo: {
      type: String,
      required: [true, 'Contact information is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['lost', 'found', 'claimed'],
      default: 'found',
      lowercase: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    reportedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

lostFoundSchema.index({ itemName: 'text', description: 'text', foundAt: 'text' });
lostFoundSchema.index({ status: 1, reportedAt: -1 });

const LostFound = mongoose.model('LostFound', lostFoundSchema);

module.exports = LostFound;
