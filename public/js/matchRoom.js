const matchRoom = function (socket, chatBtnEvent) {


  let gloChatInWrap = document.getElementById('globalChatInnerWrapper');


  const star = document.getElementById('star1');
  const star1 = document.getElementById('star2');
  const clicked = document.getElementById('clicked');
  const beepSound = document.getElementById('counter');
  const matchBgsound = document.getElementById('match');
  matchBgsound.volume = '0.1';


  let gamechk1 = false;
  let gamechk2 = false;
  let ready1 = null;
  let ready2 = null;
  let player1 = false;
  let player2 = false;

  /**
   * Game Match Room.
   */

  // Render detailed info of match room.
  socket.on('Matchroom display', (host, opp) => {

    matchBgsound.play();

    // Set host: player1 | opp: player2.
    host.socketId === socket.id ? player1 = true : player2 = true;

    // Fill Player1+2 info grid(Profile Image + Name)
    const player1Info = document.getElementById('player1Info');
    const player2Info = document.getElementById('player2Info');

    for (let player = 1; player <= 2; player++) {
      const targetParent = player === 1 ? player1Info : player2Info;
      // Append wrapper first.
      utility.appendTo('div', targetParent, 'p' + player + 'Wrap', 'playersInfo');
      const innerWrap = document.getElementById('p' + player + 'Wrap');
      // Append profile image.
      const playerImg = utility.appendTo('img', innerWrap, null, 'playersImg');
      playerImg.src = player === 1 ? host.picture : opp.picture;
      // Append progile name.
      const playerName = utility.appendTo('div', innerWrap, null, 'playersName');
      playerName.innerHTML = player === 1 ? host.name : opp.name;
    }

    ready1 = document.getElementById('player1ReadyBtn');
    ready2 = document.getElementById('player2ReadyBtn');
    const pReady = player1 ? ready1 : ready2;
    // EventListening on Ready btn of each player.
    pReady.addEventListener('click', (e) => {
      // ready checker -> style -> emit ready status.
      const pNum = player1 ? '1' : '2';
      if (pNum === '1') gamechk1 = true;
      if (pNum === '2') gamechk2 = true;
      readyBtnStyle(pReady);
      const readyFrom = pNum === '1' ? host : opp;
      const readyTo = pNum === '1' ? opp : host;
      socket.emit('readyBtn pressed', 'player' + pNum, readyFrom, readyTo);
    });

    const exitBtn = document.getElementById('exitBtn');
    exitBtn.addEventListener('click', () => {
      clicked.play();
      socket.emit('exit btn', host, opp, '/');
    });

  });

  // Press player's ready btn in opponent page automatically.
  socket.on('readyBtn', (who, host, opp) => {
    if (player2) gamechk1 = true;
    if (player1) gamechk2 = true;
    who === 'player1' ? readyBtnStyle(ready1) : readyBtnStyle(ready2);
    // Start game count the both are ready.
    if (gamechk1 && gamechk2) socket.emit('All ready', host, opp);
  });

  // helper for ready btn styling.
  function readyBtnStyle(target) {
    target === ready1 ? star.play() : star1.play();
    target.style.backgroundColor = 'rgba(180, 180, 180, 0.5)';
    target.style.paddingTop = '45px';
    target.innerHTML = 'GAME<br>READY';
  }

  // Exit btn of match game room.
  socket.on('exit room', (path) => {
    let msg = utility.appendTo('div', gloChatInWrap, null, 'errorText');
    msg.innerHTML = 'Exit buttom pressed.';
    gloChatInWrap.scrollTop = 1000;
    setTimeout(() => {
      location.href = path;
    }, 1000);
  });

  /**
   * Game Starting count.
   */

  socket.on('multi start', () => {
    gloChatInWrap = document.getElementById('globalChatInnerWrapper');
    setTimeout(() => {
      startingCount('Game Start .................. 3');
    }, 1000);
    setTimeout(() => {
      startingCount('Game Start ............ 2');
    }, 2000);
    setTimeout(() => {
      startingCount('Game Start ...... 1');
    }, 3000);
    setTimeout(() => {
      startingCount('Game Start ...');
      matchBgsound.pause();
    }, 4000);
    setTimeout(() => {
      const player = player1 ? 'player1' : 'player2';
      socket.emit('multiplay starter', player);
    }, 5000);
  });

  function startingCount(countMsg) {
    const msg = utility.appendTo('div', gloChatInWrap, null, 'startText');
    msg.innerHTML = countMsg;
    gloChatInWrap.scrollTop = 1000;
    beepSound.play();
  }


};
