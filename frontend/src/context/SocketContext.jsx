// frontend/src/context/SocketContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { ENV } from '../services/env';

const BACKEND_URL = ENV.BACKEND_URL;

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io(`${BACKEND_URL}`); // Your backend URL
      setSocket(newSocket);

      // Join a room specific to this user to receive personal updates
      newSocket.emit('joinUserRoom', user.id);

      // If the user is an admin, also join the canteen staff room
      if (user.role === 'admin') {
        newSocket.emit('joinCanteenRoom');
      }

      return () => newSocket.close();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};