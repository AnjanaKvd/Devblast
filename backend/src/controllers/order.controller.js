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
    const { items, totalAmount, customerIndex } = req.body;

    if (!items || !totalAmount || !customerIndex) {
      return res.status(400).json({ message: "Items, total amount, and customer index are required" });
    }

    // Generate a unique token for the order
    const orderToken = generateOrderToken();
    
    const newOrder = new Order({
      items,
      totalAmount,
      customerIndex,
      token: orderToken,
      counter: 1, // Initialize counter
      status: 'pending' // Set initial status
    });

    await newOrder.save();
    res.status(201).json({
      ...newOrder._doc,
      orderToken // Send the generated token back to the client
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding order", error: error.message });
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
