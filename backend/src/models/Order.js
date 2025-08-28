// anjanakvd/devblast/Devblast-89f9d51d24843601b075b0bf104bcab54f9d3f15/backend/src/models/Order.js

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  // --- NEW FIELDS TO ADD ---
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'completed', 'delayed'],
    default: 'pending',
  },
  estimatedPickupTime: {
    type: Date,
  },
  orderNumber: { // A simple, user-facing number
    type: Number,
    required: true,
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;