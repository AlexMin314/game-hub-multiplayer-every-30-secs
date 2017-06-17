(function () {

  /* Game settings */

  var settings = {};
  settings.FPS = 60;
  // Dots(emeny).
  settings.roundStart = 3; // num
  settings.roundStartMax = 18; // num
  settings.roundUpSpawn = 1; // num
  settings.speedScale = 1.0; // multiplyer
  settings.spawnSpeed = 3500; // ms
  settings.bounceBuffer = 5; // px
  // Bonus(star).
  settings.bonusSpawn = 1; // num
  settings.bonusMax = 2; // num
  settings.bonusSpawnSpeed = 4500; // ms
  // Player related
  settings.playerDotSpeed = 20; // lower = faster respond
  // Debug mode - don't touch.
  settings.godmode = false;

  /* DO NOT CHANGE BELOW */

  /* World settings */

  var world = {};
  // Player Dot.
  world.playerList = [];
  world.playerLength = 0;
  // Enemy Dots.
  world.dotList = [];
  world.dotNumIdx = 0;
  world.dotLength = 0;
  world.spawnDist = 70;
  world.colorSeed = [null, null, '#14ff00', '#00fff7', '#faff00', '#ff00de'];
  world.addChk = 0;
  // Bonus(Star).
  world.bonus = [];
  world.bonusIdx = 0;
  world.bonusLength = 0;
  world.bonusScore = 100;
  world.bonusCounter = 0;
  // Line Event(Enemy).
  world.line = [];
  world.lineEvent = false;
  world.dot1 = null;
  world.dot2 = null;
  world.lineEventTimer = 30300; // sharing with rubberBand
  // Miscellaneous.
  world.thirtySec = 30000;
  world.score = 0;
  world.pause = false;
  world.pauseLimit = 3;
  world.sound = true;
  world.spaceBar = false;
  world.clickSound = null;

  // Controller.
  var mouse = {};
  mouse.x = 0;
  mouse.y = 0;

  // Skill settings - not implemented yet.
  var skill = {};
  skill.q = false;
  skill.w = false;

  // Caching div info.
  var divs = {};
  divs.scoreBoard = null;
  divs.dotNumBoard = null;
  divs.startButtonText = null;
  divs.theWrapper = null;
  divs.player = null;


  /* Board init start!!!!! */

  // Display Start Button.
  startButton();

  // Background sound play
  backgroundSound(world, gameOverChk());

  // Append some sound effect
  utility().audio('star1', './src/star.mp3', false, false);
  utility().audio('star2', './src/star.mp3', false, false);
  utility().audio('counter', './src/count.mp3', false, false);
  utility().audio('clicked', './src/clicked.mp3', false, false);
  world.clickSound = document.getElementById('clicked');

  // *Game Starting* Flow after start button click.
  function startClick(e) {
    // Removing click events.
    document.getElementById('gameStart').removeEventListener('click', startClick, false);

    // click sound
    if (world.sound) world.clickSound.play();

    // Removing wrapper div of start page
    divs.theWrapper = utility().wrapper;
    divs.startButtonText = document.getElementById('gameStart');

    // Removing sound, debug button.
    divs.theWrapper.removeChild(utility().sound);
    divs.theWrapper.removeChild(utility().godMode);

    // Difficulty re-setting base on width when game start.
    difficulty(settings, false, window.innerWidth, window.innerHeight);

    // Showing start messages.
    tutorial(divs.startButtonText, world);

    // setTimeout for waiting tutorial ends.
    setTimeout(function () {
      // Player Spawn.
      playerSpawner(settings, world);
      divs.player = document.getElementById('playerDot1');

      //Removing start button and start game.
      gameStarter(settings, world);
      divs.scoreBoard = document.getElementById('score');
      divs.dotNumBoard = document.getElementById('dotNum');
    }, 3100);
  }


  /* Render Loops */

  (function renderLoop() {
    requestAnimFrame(renderLoop);
    // Checking start:true, pause:false, gameoverChecker: false.
    if (world.start && !world.pause && !gameOverChk()) {
      drawMovements(settings, world, mouse);
      updatingBoard(divs.scoreBoard, divs.dotNumBoard, world);
      // anti-cheat.
      difficulty(settings, true, window.innerWidth, window.innerHeight);
    }
  }());


  /* Event Listener related */

  // Retrieve methods.
  var eFunc = eventFunc(settings, world, mouse, divs);

  (function () {
    document.addEventListener('mousemove', eFunc.getMousePos, false);
    document.addEventListener('keydown', eFunc.gamePause, false);
    document.getElementById('gameStart').addEventListener('click', startClick, false);
    document.getElementById('sound').addEventListener('click', eFunc.soundButton, false);
    document.getElementById('godmode').addEventListener('click', eFunc.godButton, false);
  }());

}());
