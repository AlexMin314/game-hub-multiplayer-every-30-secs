//const socketsController = require('../controllers/sockets');

module.exports = (io) => {
  const users = [];

  io.on('connection', (socket) => {
    console.log('User connected: ', socket.id);
    let user = {};
    user.gameReady = false;

    // reassign socket value with passport data.
    if (socket.request.user.logged_in) {
      socket.userName = socket.request.user.profile.name;
      //socket.userId = socket.request.user.id;
      user.name = socket.userName;
      user.id = socket.request.user.id;
      user.socketId = socket.id;
      user.picture = socket.request.user.profile.picture;
      users.push(user);
    } else {
      // Guest
      user.name = 'GUEST ' + socket.id.slice(0,5);
      user.id = socket.id;
      user.picture = null;
      users.push(user);
    }

    updateUserList();


    // New message chat.
    newMessage(socket);

    socket.on('invitation', (userid) => {
      console.log('user clicked');
      users.forEach((e) => {
        if (e.id === userid && e.socketId !== socket.id) {
          io.to(e.socketId).emit('inviteRoom', 'hey');
        }
      })
    });

    socket.on('disconnect', (socket) => {
      console.log('User disconnect: ', user.name);
      users.forEach((e, i) => {
        if (e.name === user.name && e.id === user.id) {
          users.splice(i,1);
        }
      });
      console.log('now user list is : ' ,users);
      updateUserList();
    });

  });

  /**
   * [newMessage description]
   */
  const newMessage = (socket) => {
    socket.on('newMessage', (data) => {
      console.log('New message', data);
      io.emit('broadcast message', data, socket.userName);
    });
  };

  const updateUserList = () => {
      console.log('User list updated : ', users);
      io.emit('update user', users);
  };


};
