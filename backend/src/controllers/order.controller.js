import Order from "../models/Order.js";
import crypto from 'crypto';

// Helper function to generate a unique token
const generateOrderToken = () => {
  return 'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase();
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

export const addOrder = async (req, res) => {
  try {
    const { items, totalPrice } = req.body;
    const userId = req.user.id;
    
    // Generate a simple order number (in a real app, use a more robust method)
    const orderNumber = Math.floor(100 + Math.random() * 900);

    const newOrder = new Order({
      user: userId,
      items,
      totalPrice,
      orderNumber
    });

    const savedOrder = await newOrder.save();

    // Add the new order to the live in-memory queue
    addToQueue(savedOrder.toObject()); // Use .toObject() for a plain JS object

    // NOTE: The broadcast will happen within the queue service,
    // so no need to emit from here. The system is now event-driven.

    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  const { id, items, totalAmount, customerIndex, token, counter } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { items, totalAmount, customerIndex, token, counter },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id, status } = req.body;
  
  try {
    if (!id || !status) {
      return res.status(400).json({ message: "Order ID and status are required" });
    }
    
    const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.body;
  try {
    await Order.findByIdAndDelete(id);
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error: error.message });
  }
};

// New controller to get the current state of the queue via HTTP if needed
export const getCurrentQueue = (req, res) => {
    res.status(200).json(getLiveQueue());
};
