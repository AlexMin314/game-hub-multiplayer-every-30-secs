const Game = function (data, mode) {

  /* Game settings */

  var settings = {};
  settings.FPS = 60;
  settings.frame = 0;
  settings.mode = mode; //game mode
  // Dots(emeny).
  settings.roundStart = 2; // num
  settings.roundStartMax = 18; // num
  settings.roundUpSpawn = 1; // num
  settings.speedScale = 1.0; // multiplyer
  settings.spawnSpeed = 3000; // ms
  settings.spawnSpeed = ( settings.spawnSpeed / 1000 * settings.FPS );
  settings.bounceBuffer = 10; // px
  // Bonus(star).
  settings.bonusSpawn = 1; // num
  settings.bonusMax = 2; // num
  settings.bonusSpawnSpeed = 4000; // ms
  settings.bonusSpawnSpeed = ( settings.bonusSpawnSpeed / 1000 * settings.FPS );
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
  world.star1 = null;
  world.star2 = null;
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
  layout.startBtn();

  // Background sound play
  utility.bgSound(world, gameLogic.gameOverChk());

  // Append some sound effect
  utility.audio('star1', './src/star.mp3', false, false);
  utility.audio('star2', './src/star.mp3', false, false);
  utility.audio('counter', './src/count.mp3', false, false);
  utility.audio('clicked', './src/clicked.mp3', false, false);
  world.clickSound = document.getElementById('clicked');
  world.star1 = document.getElementById('star1');
  world.star2 = document.getElementById('star2');

  // *Game Starting* Flow after start button click.
  function startClick(e) {
    // Removing click events.
    document.getElementById('gameStart').removeEventListener('click', startClick, false);

    // click sound
    if (world.sound) world.clickSound.play();

    divs.theWrapper = document.getElementById('wrapper');
    divs.startButtonText = document.getElementById('gameStart');

    // Removing sound, debug button.
    divs.theWrapper.removeChild(document.getElementById('sound'));
    divs.theWrapper.removeChild(document.getElementById('godmode'));

    // Difficulty re-setting base on width when game start.
    gameLogic.difficulty(settings, false, window.innerWidth, window.innerHeight);

    // Showing start messages.
    layout.tutorial(divs.startButtonText, world);

    // setTimeout for waiting tutorial ends.
    setTimeout(function () {
      // Player Spawn.
      gameSpawn.playerSpawner(settings, world);
      divs.player = document.getElementById('playerDot1');

      //Removing start button and start game.
      gameSpawn.trigger(settings, world);

      divs.scoreBoard = document.getElementById('score');
      divs.dotNumBoard = document.getElementById('dotNum');
    }, 3100);
  }


  /* Render Loops */

  (function renderLoop() {
    requestAnimFrame(renderLoop);

    settings.frame++;

    // Checking start:true, pause:false, gameoverChecker: false.
    if (world.start && !world.pause && !gameLogic.gameOverChk()) {
      drawMovements(settings, world, mouse, data);

      if (settings.frame % 20 === 0) {
        layout.updatingBoard(divs.scoreBoard, divs.dotNumBoard, world);
      }

      if (settings.frame % 60 === 0) world.score++;

      if (!world.pause && settings.frame % settings.spawnSpeed === 0) {
        gameSpawn.spawnDraw(settings, world, false);
      }

      if (!world.pause
          && settings.frame % settings.bonusSpawnSpeed === 0
          && settings.frame > 200) {
        gameSpawn.spawnDraw(settings, world, true);
      }

    }

    // anti-cheat.
    if (settings.frame % 180 === 0) {
      gameLogic.difficulty(settings, true, window.innerWidth, window.innerHeight);
    }

  }());


  /* Event Listener related */

  const event = gameEvent(settings, world, mouse);

  (function () {
    document.addEventListener('mousemove', event.getMousePos, false);
    document.addEventListener('keydown', event.gamePause, false);
    document.getElementById('gameStart').addEventListener('click', startClick, false);
    document.getElementById('sound').addEventListener('click', event.soundBtn, false);
    document.getElementById('godmode').addEventListener('click', event.godBtn, false);
  }());

};
