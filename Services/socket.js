const socketIo = require('socket.io');

module.exports = (server) => {
  const io = socketIo(server);
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });

    socket.on('cursorChanged', (cursor) => {
      if (readyForUpdate === true) {
        readyForUpdate = false;
        const newObj = { id: socket.id, ...cursor.position };
        console.log(newObj);
        socket.broadcast.emit('update', newObj);
      }
    });
  });
  return io;
};
