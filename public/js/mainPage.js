(function () {
  //http://192.168.219.166:3000

  const socket = io.connect('/', { secure: true, transports: ['websocket'] });


  /**
   * [broadcast message]
   */

  socket.on('broadcast message', function (data, username) {
    //console.log(socket.userName);
    let msg = document.createElement('div');
    msg.innerHTML = '<span class="chatTextId">' + username + '</span> :  ' + data;
    msg.className = 'chatText';
    document.getElementById('globalChatInnerWrapper').appendChild(msg);
    document.getElementById('globalChatInnerWrapper').scrollTop = 1000;
  });

  const sendBtn = document.getElementById('globalSendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', function (e) {
      // e.preventDefault();
      let message = document.getElementById('globalChatVal').value;
      if (message) socket.emit('newMessage', message);
      document.getElementById('globalChatVal').value = '';
    });
  }
  const sendInput = document.getElementById('globalChatVal');
  if (sendInput) {
    sendInput.addEventListener('keypress', function (e) {
      if (event.key === 'Enter') {
        let message = document.getElementById('globalChatVal').value;
        if (message) socket.emit('newMessage', message);
        document.getElementById('globalChatVal').value = '';
      }
    });
  }


  /**
   * User List
   */
  const scoreBoardEle = document.getElementById('boardInnerWrapper');
  socket.on('update user', (users) => {
    scoreBoardEle.innerHTML = '';

    users.forEach((e) => {
      console.log('leaderboard :', e.name);
      let newUserDiv = document.createElement('div');
      newUserDiv.className = 'newUser';
      newUserDiv.id = e.id;
      scoreBoardEle.appendChild(newUserDiv);
      let theNewUserDiv = document.getElementById(e.id);
      let newUserPicDiv = document.createElement('img');
      newUserPicDiv.setAttribute('src', e.picture);
      theNewUserDiv.appendChild(newUserPicDiv);
      let newUserNameDiv = document.createElement('span');
      newUserNameDiv.innerHTML = e.name;
      theNewUserDiv.appendChild(newUserNameDiv);
    });
  });




  /**
   * [guestPlay description]
   * @type {[type]}
   */
  const guestPlay = document.getElementById('guestPlay');
  if (guestPlay) {
    guestPlay.addEventListener('click', function (e) {
      location.href = './single';
    });
  }
}());
