module.exports = (io) => {
  io.on('connection', (socket) => {

    socket.on('player mouse', (opp, mouse) => {
      io.to(opp.socketId).emit('draw mouse', mouse);
    });

  });
}
