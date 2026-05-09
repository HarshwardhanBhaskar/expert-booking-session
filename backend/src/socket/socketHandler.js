/**
 * Socket.io event handler.
 * Manages real-time connections for slot booking updates.
 */
const initializeSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocket;
