module.exports = (io) => {
  io.on('connection', (socket) => {

    socket.on('player mouse', (opp, mouse) => {
      io.to(opp.socketId).emit('draw mouse', mouse);
    });

    socket.on('pass dotList', (opp, dotList, timeGap) => {
      io.to(opp.socketId).emit('get dotList', dotList, timeGap);
    });

    socket.on('pass bonusList', (opp, bonusList) => {
      io.to(opp.socketId).emit('get bonusList', bonusList);
    });

    socket.on('pass bonusInfo', (opp, idx) => {
      io.to(opp.socketId).emit('bonus removal', idx);
    });

    socket.on('liner dots', (opp, d1, d2) => {
      io.to(opp.socketId).emit('get liner', d1, d2);
    });

  });
}
