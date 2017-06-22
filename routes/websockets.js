//const socketsController = require('../controllers/sockets');
const gameController = require('../controllers/game');

module.exports = (io) => {
  const users = [];

  io.on('connection', (socket) => {
    console.log('==User connected: ', socket.id);
    let user = {};


    // reassign socket value with passport data.
    if (socket.request.user.logged_in) {
      socket.userName = socket.request.user.profile.name;
      socket.roomName = '';
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
      user.socketId = socket.id;
      user.status = 'guest';
      user.picture = null;
      users.push(user);
    }


    updateUserList();

    socket.on('invitation', (userid) => {
      users.forEach((e) => {
        if (e.socketId === socket.id) {
          e.status = 'busy';
        }
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

    socket.on('newMessage', (data) => {
      io.to(socket.roomName).emit('broadcast message', data, socket.userName);
    });

    socket.on('enter lobby', () => {
      socket.join('lobby');
      socket.roomName = 'lobby';
    });

    socket.on('join gameRoom', (roomNum) => {
      socket.roomName = roomNum;
      socket.leave('lobby');
      socket.join(roomNum);
    });

    socket.on('invitation confirmed', (roomNum, host) => {
      socket.roomName = roomNum;
      socket.leave('lobby');
      socket.join(roomNum);

      const dataOpp = {};
      dataOpp.socketId = user.socketId;
      dataOpp.name = user.name;
      dataOpp.picture = user.picture;

      const dataHost = {};
      users.forEach((e) => {
        if (e.socketId === host) {
          dataHost.socketId = host;
          dataHost.name = e.name;
          dataHost.picture = e.picture;
        }
      });

      io.to(host).emit('join room', roomNum);
      io.to(host).emit('Matchroom display', dataHost, dataOpp);
      io.to(socket.id).emit('Matchroom display', dataHost, dataOpp);
    });

    socket.on('invitation declined', (host) => {
      users.forEach((e) => {
        if (e.socketId === host) e.status = 'idle';
        if (e.socketId === socket.id) {
          e.status = 'idle';
          io.to(host).emit('error message', 'decline');
        }
      })

    });

    socket.on('game readyBtn', (from, to, host) => {
      io.to(to.socketId).emit('readyBtn', from, to, host);
    });

    socket.on('ready checker', (from, to) => {
      io.to(from.socketId).emit('multi start');
      io.to(to.socketId).emit('multi start');
    });

    socket.on('exit btn', (from, to, path) => {
      io.to(from.socketId).emit('exit room', path);
      io.to(to.socketId).emit('exit room', path);
    });

    socket.on('singleplay starter', () => {
      const miniData = {};
      miniData.id = user.id;
      miniData.name = user.name;
      miniData.guest = user.guest;
      io.to(socket.id).emit('singleplay start', miniData);
    });

    // game result

    socket.on('postScore', (gameResult) => {
      gameController.postScoreSocket(gameResult);
    })

    socket.on('getScoreBoard', (status) => {
      gameController.getScoreSocket(function (rank) {
        io.to(socket.id).emit('drawScoreBoard', rank, status);
      });
    })



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
    //if (socket.rooms.indexOf(room) >= 0) {
      socket.on('newMessage', (data) => {
        console.log(Object.key(socket.rooms)[1]);
        io.to(room).emit('broadcast message', data, socket.userName);
      });
    //}
  };

  const updateUserList = () => {
    console.log('==User list updated : ', users.length);
    io.emit('update user', users);
  };


};
