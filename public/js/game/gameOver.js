// Game over and Showing game result.
const gameOverAndResult = (world) => {

  // ====> SAVE SOCRE HERE!!

  const gameBoard = document.getElementById('board');

  // Removing dot elements.
  gameBoard.innerHTML = '';

  // Clear beep sound.
  clearInterval(world.thirtySecBeep);

  // Play game over sound
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

  // ====> Leader Board!! here??


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
