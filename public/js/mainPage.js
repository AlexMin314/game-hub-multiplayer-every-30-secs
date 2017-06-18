(function () {
//http://192.168.219.166:3000

  const socket = io.connect('/', { secure: true, transports: ['websocket'] });


  socket.on('broadcast message', function (data) {
    //console.log(data);
    let msg = document.createElement('div');
    msg.innerHTML = data;
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


  const guestPlay = document.getElementById('guestPlay');
  if (guestPlay) {
    guestPlay.addEventListener('click', function (e) {
      location.href = './single';
    });
  }
}());
