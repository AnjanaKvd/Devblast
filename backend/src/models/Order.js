import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  totalAmount: { type: Number, required: true },
  customerIndex: { type: String, required: true },
  token: { type: String, required: true },
  counter: { type: Number, default: 1 },
  status: { 
    type: String, 
    enum: ['pending', 'in-progress', 'completed', 'cancelled'], 
    default: 'pending' 
  }
}, { timestamps: true });


const Order = mongoose.model("Order", orderSchema);

export default Order;