import { Server } from 'socket.io';

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('joinRoom', (roomId) => {
        socket.join(roomId);
        const room = io.sockets.adapter.rooms.get(roomId);
        if (room && room.size === 2) {
          io.to(roomId).emit('startGame');
        }
      });
    });
  }
  res.end();
};

export default SocketHandler;