const mainRoom = (function () {

  const socket = io.connect('/', { secure: true, transports: ['websocket'] });
  //const socket = io.connect('http://192.168.219.166:3000', { secure: true, transports: ['websocket'] });

  const gloalChat = document.getElementById('globalChat');
  let gloChatInWrap = document.getElementById('globalChatInnerWrapper');
  const charInput = document.getElementsByClassName('chatInput')[0];
  const mainContainer = document.getElementById('mainContainer');

  const matchtpl = document.getElementById('matchMenuTpl').innerHTML;
  const roomLayoutTpl = document.getElementById('roomLayout').innerHTML;

  // const star = document.getElementById('star1');
  // const star1 = document.getElementById('star2');
  const clicked = document.getElementById('clicked');
  const beepSound = document.getElementById('counter');
  beepSound.volume = '0.5';
  clicked.volume = '0.8';

  let multiButtonChk = true;
  let matchMenuEle;

  const multiPlayerBtn = document.getElementById('multiPlay');

  /**
   * Chat related.
   */

  socket.on('broadcast message', function (chat, username) {
    const msg = utility.appendTo('div', gloChatInWrap, null, 'chatText');
    msg.innerHTML = '<span class="chatTextId">' + username + ' </span> :  ';
    msg.innerHTML += chat;
    gloChatInWrap.scrollTop = 1000;
  });

  // Error msg for match invitation.
  socket.on('error message', function (type) {
    const msg = utility.appendTo('div', gloChatInWrap, null, 'errorText');
    switch (type) {
      case 'busy':
        msg.innerHTML = 'The player busy now, try later.';
        break;
      case 'wait':
        msg.innerHTML = 'Match invitation has been sent.';
        break;
      case 'decline':
        msg.innerHTML = 'The player declined your invitation.';
        break;
      case 'guest':
        msg.innerHTML = 'Can not play multiplayer game with guests.';
        break;
    }
    gloChatInWrap.scrollTop = 1000;
  });


  /*
   * Lobby, invitation process related.
   */

  // Enter to global chat when connect.
  socket.emit('enter lobby');

  socket.on('join room', (roomNum) => {
    // Remove main lobby layout.
    mainContainer.innerHTML = '';
    // Render match room tpl.
    mainContainer.innerHTML = roomLayoutTpl;
    // EventListening on chat send btn, enter key for new chatroom
    chatBtnEvent();
    socket.emit('join gameRoom', roomNum);
  });

  function chatBtnEvent() {
    gloChatInWrap = document.getElementById('globalChatInnerWrapper');
    const sendBtn = document.getElementById('globalSendBtn');
    const sendInput = document.getElementById('globalChatVal');

    // Send Btn.
    if (sendBtn) {
      sendBtn.addEventListener('click', (e) => {
        const message = sendInput.value;
        if (message) socket.emit('newMessage', message);
        sendInput.value = '';
      });
    }
    // Enter key.
    if (sendInput) {
      sendInput.addEventListener('keypress', (e) => {
        if (event.key === 'Enter') {
          const message = sendInput.value;
          if (message) socket.emit('newMessage', message);
          sendInput.value = '';
        }
      });
    }
  }
  // EventListening on chat send btn, enter key for Global Lobby.
  chatBtnEvent();

  // Match inviation window display.
  socket.on('inviteRoom display', function (roomNum, host, users) {
    // If opp user in multiplayer menu, turn off the menu for receiving invitation.
    if (matchMenuEle) {
      gloChatInWrap.style.display = 'block';
      charInput.style.display = 'table';
      gloalChat.removeChild(matchMenuEle);
    }
    // Render invitation popup menu
    const inviteWindowDiv = utility.appendTo('div', gloChatInWrap, 'inviteWindow', null);
    inviteWindowDiv.innerHTML = "<div class='col-xs-12'>You've got a<br>Match Invitation</div>";
    inviteWindowDiv.innerHTML += "<div class='col-xs-6' id='inviteBtnC'><p>ACCEPT</p></div>";
    inviteWindowDiv.innerHTML += "<div class='col-xs-6' id='inviteBtnD'><p>DECLINE</p></div>";
    beepSound.play(); // ding dong??

    const inviteWindow = document.getElementById('inviteWindow');
    const declineBtn = document.getElementById('inviteBtnD');
    const agreeBtn = document.getElementById('inviteBtnC');


    // Prevent clicking event of multiplayer btn when user got invitation.
    multiPlayerBtn.removeEventListener('click', multiBtnEvent);

    // Agree btn of invitation.
    agreeBtn.addEventListener('click', (e) => {
      clicked.play();
      mainContainer.innerHTML = '';
      mainContainer.innerHTML = roomLayoutTpl;
      chatBtnEvent();
      socket.emit('invitation confirmed', roomNum, host);
    });

    // Decline btn of invitation.
    declineBtn.addEventListener('click', (e) => {
      clicked.play();
      gloChatInWrap.removeChild(inviteWindow);
      if (multiPlayerBtn) multiPlayerBtn.addEventListener('click', multiBtnEvent);
      socket.emit('invitation declined', host);
    });

    // after 5 sec, automatically decline the invitation
    setTimeout(() => {
      if (document.getElementById('inviteBtnD')) declineBtn.click();
    }, 5000);
  });




  /**
   * User List, Score Board Dispaly
   */

  const userList = document.getElementById('boardInnerWrapper');
  if (userList) {
    // Updating user list
    socket.on('update user', (users) => {
      userList.innerHTML = '';
      users.forEach((e) => {
        utility.appendTo('div', userList, e.id, 'newUser');
        const theNewUserDiv = document.getElementById(e.id);
        // User will be clicked only when multiplayer btn activated.
        theNewUserDiv.addEventListener('click', (event) => {
          if (!multiButtonChk && matchMenuEle) {
            gloalChat.removeChild(matchMenuEle);
            gloChatInWrap.style.display = 'block';
            charInput.style.display = 'table';
            multiButtonChk = !multiButtonChk;
            clicked.play();
            socket.emit('invitation', e.id);
          }
        });
        // Render Profile Images of user list.
        if (e.picture) {
          const newUserPicDiv = utility.appendTo('img', theNewUserDiv, null, null);
          newUserPicDiv.setAttribute('src', e.picture);
        }
        // Render Profile Name of user list.
        const newUserNameDiv = utility.appendTo('span', theNewUserDiv, null, null);
        newUserNameDiv.innerHTML = e.name;
      });
    });
  }


  /**
   * game related
   */

  const guestPlay = document.getElementById('guestPlay');
  if (guestPlay) {
    guestPlay.addEventListener('click', (e) => {
      clicked.play();
      socket.emit('singleplay starter');
    });
  }

  const singlePlayer = document.getElementById('singlePlay');
  if (singlePlayer) {
    singlePlayer.addEventListener('click', (e) => {
      clicked.play();
      socket.emit('singleplay starter');
    });
  }

  if (multiPlayerBtn) {
    multiPlayerBtn.addEventListener('click', multiBtnEvent);
  }
  function multiBtnEvent(e) {
    clicked.play();
    matchMenuSwap(multiButtonChk);
    multiButtonChk = !multiButtonChk;
  }

  // Match invitation menu swap helper.
  function matchMenuSwap(chk) {
    if (chk) {
      gloChatInWrap.style.display = 'none';
      charInput.style.display = 'none';
      utility.appendTo('div', gloalChat, 'matchMenu', 'container');
      matchMenuEle = document.getElementById('matchMenu');
      matchMenu();
    } else {
      gloChatInWrap.style.display = 'block';
      charInput.style.display = 'table';
      gloalChat.removeChild(matchMenuEle);
    }
  }

  // Render Match menu
  function matchMenu() {
    const matchtplDiv = utility.appendTo('div', matchMenuEle, null, null);
    matchtplDiv.innerHTML = matchtpl;

    const vsModeEle = document.getElementById('vsMode');
    const coopModeEle = document.getElementById('coopMode');
    vsModeEle.addEventListener('click', (e) => {
      clicked.play();
      vsModeEle.style.backgroundColor = 'rgba(180, 180, 180, 0.53)';
      coopModeEle.style.backgroundColor = 'rgba(255, 255, 255, 0)';
      document.getElementById('descriptMode').style.display = 'none';
      document.getElementById('descriptUser').style.display = 'block';
    });
    coopModeEle.addEventListener('click', (e) => {
      clicked.play();
      vsModeEle.style.backgroundColor = 'rgba(255, 255, 255, 0)';
      coopModeEle.style.backgroundColor = 'rgba(180, 180, 180, 0.53)';
      document.getElementById('descriptMode').style.display = 'none';
      document.getElementById('descriptUser').style.display = 'block';
    })
  }



  /*
   * Cloure.
   */
  gameStart(socket);
  gameFinish(socket);
  matchRoom(socket, chatBtnEvent);

  return {
    socket: socket
  }

}());
