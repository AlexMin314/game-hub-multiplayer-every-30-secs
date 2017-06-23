//const socketsController = require('../controllers/sockets');
const gameController = require('../controllers/game');

module.exports = (io) => {
  const users = [];

  io.on('connection', (socket) => {
    console.log('==User connected: ', socket.id);
    const user = {};


    // reassign socket value with passport data.
    if (socket.request.user.logged_in) {
      socket.userName = socket.request.user.profile.name;
      user.roomName = '';
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


    io.emit('update user', users);

    /**
     * Message
     */

    socket.on('newMessage', (data) => {
      io.to(user.roomName).emit('broadcast message', data, socket.userName);
    });

    /**
     * Invitation and Matchroom
     */

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


    socket.on('enter lobby', () => {
      socket.join('lobby');
      user.roomName = 'lobby';
    });

    socket.on('join gameRoom', (roomNum) => {
      user.roomName = roomNum;
      socket.leave('lobby');
      socket.join(roomNum);
    });

    socket.on('invitation confirmed', (roomNum, host) => {
      user.roomName = roomNum;
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
      io.to(from.socketId).emit('multi start', from.socketId);
      io.to(to.socketId).emit('multi start', to.socketId);
    });

    socket.on('exit btn', (from, to, path) => {
      io.to(from.socketId).emit('exit room', path);
      io.to(to.socketId).emit('exit room', path);
    });

    /**
     * Game
     */

    socket.on('singleplay starter', (player) => {
      const miniData = {};
      miniData.id = user.id;
      miniData.name = user.name;
      miniData.guest = user.guest;
      io.to(socket.id).emit('singleplay start', miniData);
    });

    socket.on('multiplay starter', (player) => {
      const miniData = {};
      miniData.id = user.id;
      miniData.name = user.name;
      miniData.guest = user.guest;
      miniData.room = user.roomName;

      const roster = [];
      users.forEach((e) => {
        if(e.roomName === miniData.room) roster.push(e);
      });

      io.to(socket.id).emit('multiplay start', miniData, roster);
    });

    socket.on('resolution post', (width, height, data) => {
      users.forEach((e) => {
        if (data.room === e.roomName && data.id !== e.id) {
          io.to(e.socketId).emit('resolution fixer', width, height);
        }
      });
    });

    socket.on('gameOver deliver', (loser, winner, rosterArr, world) => {
      //console.log('loser' + loser.socketId);
      io.to(winner.socketId).emit('get winnerInfo', winner, rosterArr, 'win');
      io.to(loser.socketId).emit('gameOver post', loser, rosterArr, 'lose', world);
    });
    socket.on('winner gameover', (winner, rosterArr, status, world) => {
      io.to(winner.socketId).emit('gameOver post', winner, rosterArr, 'win', world);
    });


    /**
     * Score
     */

    socket.on('postScore', (gameResult) => {
      gameController.postScoreSocket(gameResult);
    })

    socket.on('getScoreBoard', (status) => {
      gameController.getScoreSocket(function (rank) {
        io.to(socket.id).emit('drawScoreBoard', rank, status);
      });
    })



    /**
     * [disconnect description]
     */

    socket.on('disconnect', (socket) => {
      console.log('==User disconnect: ', user.name);
      users.forEach((e, i) => {
        if (e.name === user.name && e.id === user.id) {
          users.splice(i, 1);
        }
      });
      io.emit('update user', users);
    });

  });

};
