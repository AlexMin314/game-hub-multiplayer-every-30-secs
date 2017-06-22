// Game over and Showing game result.
const gameOverAndResult = (settings, world, data) => {

  const gameBoard = document.getElementById('board');
  // const ajax = false; // test purpose

  const gameResult = {}
  gameResult.score = world.score;
  if (settings.mode === 'single') gameResult.match = 'single';
  if (settings.mode === 'multiplay') {
    // gameResult.match = 'win';
  }
  gameResult.id = data.id;
  gameResult.name = data.name;

  // Post Score
  // if (!data.guest && ajax) postScore(data, gameResult)

  if (!data.guest) mainRoom.socket.emit('postScore', gameResult);


  // Get rank info.
  // let rankArr = getScoreRank();
  // rankArr = rankArr.slice(0, 5);

  // Removing dot elements.
  gameBoard.innerHTML = '';

  // Clear beep sound.
  clearInterval(world.thirtySecBeep);

  // Play game over sound ---------
  if (world.sound) utility.bgSound(world, gameLogic.gameOverChk());

  // Appending Wrapper to game board for game over screen.
  utility.makeWrapper();
  const wrapper = document.getElementById('wrapper');

  // Appending scoreResultDiv to the wrapper
  const scoreResultDiv = utility.appendTo('div', wrapper, 'scoreResult');
  scoreResultDiv.innerHTML = 'SCORE: ' + world.score;

  // Appending gameOverDiv to the wrapper
  const gameOverDiv = utility.appendTo('div', wrapper, 'gameOver');
  gameOverDiv.innerHTML = 'GAME OVER';

  const gameOverRank = (res) => {
    gameOverDiv.innerHTML = '';
    gameOverDiv.style.paddingTop = '30px';
    res.forEach((e, i) => {
      setTimeout(() => {
        utility.appendTo('p', gameOverDiv, 'rank' + i);
        const rankList = document.getElementById('rank' + i);
        rankList.className = 'fadeInUp';
        rankList.innerHTML = '# ' + (i + 1) + ' ';
        rankList.innerHTML += e.name + ' ';
        rankList.innerHTML += e.score;
      }, 200 * i);
    });
  };

  // ====> Leader Board!! here??
  // if (ajax) {
  //   setTimeout(() => {
  //     getScoreRank(gameOverRank);
  //   }, 1000);
  // }
  mainRoom.socket.emit('getScoreBoard', 'gameover');

  mainRoom.socket.on('drawScoreBoard', (data, status) => {
    if (status === 'gameover') data = data.slice(0, 5);
    setTimeout(() => {
      gameOverRank(data);
    }, 1000);
  });


  // Appending retryDiv to the wrapper
  const retryDiv = utility.appendTo('div', wrapper, 'retry')
  retryDiv.innerHTML = '<i class="fa fa-repeat"></i>  RETRY';

  // Event Listening on RETRY.
  document.getElementById('retry').addEventListener('click', (e) => {
    // Beep sound when retry clicked.
    if (world.sound) world.clickSound.play();

    // Back to main lobby.
    setInterval(() => {
      location.href = './';
    }, 700);
  }, false);

};
