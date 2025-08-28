// backend/src/services/queue.service.js

// This array will hold the live queue in memory for speed
let liveQueue = [];
const AVG_PREP_TIME_MINUTES = 3; // Average time to prepare one order

// This function recalculates times for the entire queue
const broadcastQueueUpdate = (io) => {
  let currentTime = new Date();
  liveQueue.forEach((order, index) => {
    const estimatedMinutes = (index + 1) * AVG_PREP_TIME_MINUTES;
    order.estimatedPickupTime = new Date(currentTime.getTime() + estimatedMinutes * 60000);
  });
  
  // Broadcast the entire updated queue to the admin dashboard
  io.to('canteen_staff').emit('queueUpdate', liveQueue);
  
  // Send individual updates to each user
  liveQueue.forEach(order => {
    io.to(order.user.toString()).emit('personalQueueUpdate', {
        estimatedPickupTime: order.estimatedPickupTime,
        queuePosition: liveQueue.findIndex(o => o._id === order._id) + 1
    });
  });
};

export const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('A client connected:', socket.id);

    // Room for canteen staff
    socket.on('joinCanteenRoom', () => {
      socket.join('canteen_staff');
      socket.emit('queueUpdate', liveQueue); // Send initial queue state
    });

    // Room for individual users
    socket.on('joinUserRoom', (userId) => {
      socket.join(userId);
    });
    
    // --- Event Handlers from Canteen ---
    socket.on('markAsCompleted', (orderId) => {
      liveQueue = liveQueue.filter(order => order._id.toString() !== orderId);
      broadcastQueueUpdate(io);
    });

    socket.on('markAsDelayed', (orderId) => {
      // Logic to move to a separate waiting list would go here
      console.log(`Order ${orderId} marked as delayed.`);
      // For now, we'll just remove it to demonstrate recalculation
      liveQueue = liveQueue.filter(order => order._id.toString() !== orderId);
      broadcastQueueUpdate(io);
    });

    socket.on('disconnect', () => {
      console.log('A client disconnected:', socket.id);
    });
  });
};

// Functions to be called by your order controller
export const addToQueue = (order) => {
  liveQueue.push(order);
};

export const getLiveQueue = () => liveQueue;