module.exports = (io) => {
  let users = [];

  console.log('socket.io module loaded');

  io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);
    socket.userName = socket.request.user.profile.name;
    socket.userId = socket.request.user.id;
    console.log(socket.userName);
    console.log(socket.userId);

    socket.on('newMessage', (data) => {
      console.log('New message', data);
      io.emit('broadcast message', data);
    });

  });
};
