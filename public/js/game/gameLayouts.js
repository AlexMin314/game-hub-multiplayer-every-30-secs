const layout = (function () {

  // Caching div info.
  const divInfo = {};
  divInfo.soundE = null;
  divInfo.godModeE = null;
  divInfo.wrapper = null;
  divInfo.debugE = null;
  divInfo.pause = document.getElementById('pause');
  divInfo.gameBoard = document.getElementById('board');

  // Appending Start Button to game board.
  const startButton = () => {

    // Appending Wrapper to game board.
    utility.makeWrapper();
    divInfo.wrapper = document.getElementById('wrapper');
    //console.log(document.getElementById('wrapper'));

    // Appending Start Button to wrapper.
    var sButton = utility.appendTo('div', divInfo.wrapper, 'gameStart');
    sButton.innerHTML = 'START<br>BUTTON';

    // Appending Sound Button to wrapper.
    var soundButton = utility.appendTo('div', divInfo.wrapper, 'sound');
    soundButton.innerHTML = '<i class="fa fa-volume-up"></i> on';
    divInfo.soundE = document.getElementById('sound');

    // Appending Start Button to wrapper.
    var godmodeButton = utility.appendTo('div', divInfo.wrapper, 'godmode');
    godmodeButton.innerHTML = '<i class="fa fa-toggle-off fa-lg" title="DebugMode"></i>';
    divInfo.godModeE = document.getElementById('godmode');

    // Appending Instruction texts.
    var instructionDiv = utility.appendTo('div', divInfo.wrapper, 'instruction');
    instructionDiv.innerHTML = 'DODGE DOTS <i class="fa fa-star fa-spin"></i> GRAB STARS<br>';
    instructionDiv.innerHTML += '<p>MOUSE CONTROL | PAUSE: SPACEBAR</p>';
  };


  // Game Pause Screen display.
  const gamePauseScreen = (world) => {
    divInfo.pause.pause.style.visibility = 'hidden';
    if (world.pauseLimit % 1 !== 0) {
      divInfo.pause.pause.style.visibility = 'visible';
      divInfo.pause.pause.innerHTML = 'GAME PAUSED<br>';
      divInfo.pause.pause.innerHTML += '<span>' + (world.pauseLimit - 0.5) + ' TIMES LEFT</span>';
    }
  };


  /* Sound and Godmode setting */

  // Change sound button when it is clicked.
  const soundOnOff = (world) => {
    if (world.sound) {
      divInfo.soundE.style.color = 'white';
      divInfo.soundE.innerHTML = '<i class="fa fa-volume-up"></i> on';
    } else {
      divInfo.soundE.style.color = 'grey';
      divInfo.soundE.innerHTML = '<i class="fa fa-volume-off"></i> mute';
    }
  };

  // Change godMode(debug) button when it is clicked.
  const godOnOff = (settings) => {
    if (!settings.godmode) {
      divInfo.godModeE.style.color = 'white';
      divInfo.godModeE.innerHTML = '<i class="fa fa-toggle-off fa-lg" title="DebugMode"></i>';
      if (divInfo.debugE !== null) divInfo.wrapper.removeChild(divInfo.debugE);
    }
    if (settings.godmode) {
      divInfo.godModeE.style.color = 'red';
      divInfo.godModeE.innerHTML = '<i class="fa fa-toggle-on fa-lg" title="DebugMode"></i>';
      // inserd Debug Mode ON message.
      const debug = utility.appendTo('div', divInfo.wrapper, 'debug');
      debug.innerHTML = 'Debug Mode ON';
      divInfo.debugE = document.getElementById('debug');
    }
  };


  /* Game info related */

  // Append Score and Dot number
  const boardInfo = (world) => {
    // Adding Score at right side of game board.
    const scoreDiv = utility.appendTo('div', divInfo.gameBoard, 'score');
    scoreDiv.innerHTML = 'SCORE.<br>' + world.score;

    // Adding Dot number at right side of game board.
    const dotNum = utility.appendTo('div', divInfo.gameBoard, 'dotNum');
    dotNum.innerHTML = 'DOTS<br>' + world.dotLength;
  };

  // Updating Dot Numbers and Scores on gameBoard.
  const updatingBoard = (scoreBoard, dotNumBoard, world) => {
    scoreBoard.innerHTML = 'SCORE<br>' + world.score;
    dotNumBoard.innerHTML = 'DOTS<br>' + world.dotLength;
  };

  // Showing starting messages.
  const tutorial = (startButtonText, world) => {
    const interval = 700;

    setTimeout(() => {
      startButtonText.style.border = '0px';
      
      startButtonText.innerHTML = 'EVERY<br>30 SECS';
    }, interval * 0);

    setTimeout(() => {
      startButtonText.innerHTML = 'GOOD<br>LUCK';
    }, interval * 1);

    setTimeout(() => {

      startButtonText.style.fontSize = '200px';
      startButtonText.style.paddingTop = '0px';

      // Counting sound play.
      utility.startCountBeep(world, startButtonText, '3');
    }, interval * 2);

    setTimeout(() => {
      utility.startCountBeep(world, startButtonText, '2');
    }, interval * 3);

    setTimeout(() => {
      utility.startCountBeep(world, startButtonText, '1');
    }, interval * 4);
  };


  return {
    startBtn: startButton,
    gamePause: gamePauseScreen,
    soundOnOff: soundOnOff,
    godOnOff: godOnOff,
    boardInfo: boardInfo,
    updatingBoard: updatingBoard,
    tutorial: tutorial
  }

}());
