import app from './app.js';
import { connectDB } from './config/db.js';
import { ENV } from './config/env.js';

// --- NEW IMPORTS ---
import { createServer } from 'http';
import { Server } from 'socket.io';
import { initializeSocket } from './services/queue.service.js'; // We will create this next

const { PORT, FRONTEND_URL } = ENV;
connectDB();

// --- MODIFIED SERVER STARTUP ---
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: `${FRONTEND_URL}`, // Your frontend URL
    methods: ["GET", "POST"]
  }
});

// Initialize our real-time queue service
initializeSocket(io);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});