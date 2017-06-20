//const socketsController = require('../controllers/sockets');

module.exports = (io) => {
  const users = [];
  const curGameRoom = [];
  let room = '';

  io.on('connection', (socket) => {
    console.log('==User connected: ', socket.id);
    let user = {};

    // reassign socket value with passport data.
    if (socket.request.user.logged_in) {
      socket.userName = socket.request.user.profile.name;
      //socket.userId = socket.request.user.id;
      user.name = socket.userName;
      user.guest = false;
      user.id = socket.request.user.id;
      user.socketId = socket.id;
      user.status = 'idle';
      user.picture = socket.request.user.profile.picture;
      users.push(user);
    } else {
      // Guest
      user.name = 'GUEST ' + socket.id.slice(0, 5);
      user.guest = true;
      user.id = socket.id;
      user.status = 'guest';
      user.picture = null;
      users.push(user);
    }

    // game room socket id update.
    curGameRoom.forEach((e) => {
      if (e.player1.id === user.id) e.player1.socketId = socket.id;
      if (e.player2.id === user.id) e.player2.socketId = socket.id;
    })

    updateUserList();

    socket.on('join room', (data) => {
      room = data.substr(-8);
      if (/\//.test(room)) {
        room = 'global';
        user.status = 'idle'
        if (user.guest) user.status = 'guest';
      } else {
        user.status = 'busy';
      }
      socket.join(room);
      newMessage(socket, room);
    });


    socket.on('invitation', (userid) => {
      users.forEach((e) => {
        if (e.id === userid && e.socketId !== socket.id) {
          if (e.status === 'idle') {
            let roomNum = userid.slice(0, 5) + Math.floor(Math.random() * 100 + 100);
            e.status = 'wait';
            io.to(socket.id).emit('error message', 'wait');
            return io.to(e.socketId).emit('inviteRoom', roomNum, socket.id, users);
          }
          if (e.status === 'busy' || e.status === 'wait') {
            io.to(socket.id).emit('error message', 'busy');
          }
          if (e.status === 'guest') {
            io.to(socket.id).emit('error message', 'guest');
          }
        }
      });
    });


    socket.on('invitation confirmed', (roomNum, host) => {
      io.to(host).emit('Enter Room', roomNum, host);
    });

    socket.on('invitation declined', (host) => {
      users.forEach((e) => {
        if (e.socketId === socket.id) {
          e.status = 'idle';
        }
      })

    });

    socket.on('Current GameRoom', (player1, player2, room) => {
      let curGame = {};
      curGame.player1 = player1;
      curGame.player2 = player2;
      curGame.room = room;
      curGameRoom.push(curGame);
    });

    socket.on('join gameRoom', (data) => {
      let gameRoom = data.substr(-8);
      let curGameInfo;
      curGameRoom.forEach((e) => {
        if (e.room === gameRoom) curGameInfo = e;
      });
      if (curGameInfo) {
        io.to(socket.id).emit('Matchroom display', curGameInfo);
      }
    });

    socket.on('game readyBtn', (who, data) => {
      io.to(data.room).emit('readyBtn', who, data);
    });

    socket.on('ready checker', (data) => {
      io.to(data.room).emit('multi start');
    });



    socket.on('disconnect', (socket) => {
      console.log('==User disconnect: ', user.name);
      users.forEach((e, i) => {
        if (e.name === user.name && e.id === user.id) {
          users.splice(i, 1);
        }
      });
      updateUserList();
    });

  });

  /**
   * [newMessage description]
   */
  const newMessage = (socket, room) => {
    socket.on('newMessage', (data) => {
      io.in(room).emit('broadcast message', data, socket.userName);
    });
  };

  const updateUserList = () => {
    console.log('==User list updated : ', users.length);
    io.emit('update user', users);
  };


};
