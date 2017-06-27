const Game = function (cPlayer, mode, rosterArr, socket) {

  /* Game settings */

  const settings = {};
  settings.FPS = 30;
  settings.frame = 0;
  settings.mode = mode; // game mode
  settings.pList = rosterArr; // ['player1', 'player2']
  settings.player = cPlayer.player; // 'player1' String.
  settings.socket = socket; // cur socket.
  if (settings.mode === 'multi') {
    rosterArr.forEach((e) => {
      if (e.socketId !== socket.id) settings.oppPlayer = e;
    });
  }
  // Dots(emeny).
  settings.roundStart = 2; // num
  settings.roundStartMax = 18; // num
  settings.roundUpSpawn = 1; // num
  settings.speedScale = 1.0; // multiplyer
  settings.spawnSpeed = 5000; // ms
  settings.spawnSpeed = (settings.spawnSpeed / 1000 * settings.FPS);
  settings.bounceBuffer = 10; // px
  // Bonus(star).
  settings.bonusSpawn = 1; // num
  settings.bonusMax = 2; // num
  settings.bonusSpawnSpeed = 6000; // ms
  settings.bonusSpawnSpeed = (settings.bonusSpawnSpeed / 1000 * settings.FPS);
  // Player related
  settings.playerDotSpeed = 20; // lower = faster respond
  // Debug mode - don't touch.
  settings.godmode = true;

  /* DO NOT CHANGE BELOW */

  /* World settings */

  const world = {};
  // Player Dot.
  world.playerList = [];
  world.playerLength = 0;
  // Enemy Dots.
  world.dotList = [];
  world.dotListInfo = [];
  world.dotNumIdx = 0;
  world.dotLength = 0;
  world.spawnDist = 53;
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
  if (settings.mode !== 'single') world.pauseLimit = 0;
  world.sound = true;
  world.spaceBar = false;
  world.clickSound = null;
  world.gameover = false;

  // Controller.
  const mouse = {};
  mouse.x = 0;
  mouse.y = 0;
  mouse.x1 = 0;
  mouse.y1 = 0;
  mouse.x2 = 0;
  mouse.y2 = 0;

  // Skill settings - not implemented yet.
  const skill = {};
  skill.q = false;
  skill.w = false;

  // Caching div info.
  const divs = {};
  divs.gameBoard = null;
  divs.scoreBoard = null;
  divs.dotNumBoard = null;
  divs.startButtonText = null;
  divs.theWrapper = null;
  let bRect;


  /* Board init start!!!!! */

  // Display Start Button.
  if (settings.mode === 'single') layout.startBtn();

  // Background sound play
  utility.bgSound(world, gameLogic.gameOverChk());

  // sound effect
  world.clickSound = document.getElementById('clicked');
  world.star1 = document.getElementById('star1');
  world.star2 = document.getElementById('star2');

  // *Game Starting* Flow after start button click.

  if (settings.mode === 'single') {
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
        gameSpawn.playerSpawner(settings, world, 1);

        //Removing start button and start game.
        gameSpawn.trigger(settings, world);

        divs.scoreBoard = document.getElementById('score');
        divs.dotNumBoard = document.getElementById('dotNum');
      }, 3100);

    }
  }

  if (settings.mode === 'multi') {
    // find smaller resolution and fix game board!
    const board = document.getElementById('board');

    socket.emit('resolution post', window.innerWidth, window.innerHeight, cPlayer);

    socket.on('resolution fixer', (width, height) => {
      const boardWidth = window.innerWidth > width ? width : window.innerWidth;
      const boardHeight = window.innerHeight > height ? height : window.innerHeight;
      board.style.width = boardWidth + 'px';
      board.style.height = boardHeight + 'px';
      board.style.border = '2px solid orange';
      board.style.margin = '0 auto';
      if (window.innerHeight > height) {
        const top = (window.innerHeight - boardHeight - 10) / 2;
        board.style.marginTop = top + 'px';
      }
    });

    setTimeout(() => {
      bRect = utility.board.getBoundingClientRect();
      gameSpawn.playerSpawner(settings, world, 1);
      gameSpawn.playerSpawner(settings, world, 2);

      setTimeout(() => {
        // setTimeout for waiting tutorial ends.
        gameLogic.difficulty(settings, false, window.innerWidth, window.innerHeight);
        gameSpawn.trigger(settings, world, settings.playerList);

        divs.scoreBoard = document.getElementById('score');
        divs.dotNumBoard = document.getElementById('dotNum');
      }, 500);
    }, 100);

  }


  /* Render Loops */
  socket.on('get dotList', (dotList) => {
    world.dotListInfo = dotList;
    //world.dotLength = world.dotList.length;
  });

  (function renderLoop() {
    requestAnimFrame(renderLoop);

    settings.frame++;

    // Checking start:true, pause:false, gameoverChecker: false.
    if (world.start && !world.pause && !gameLogic.gameOverChk() && !world.gameover) {
      // Draw entire movement.
      drawMovements(settings, world, mouse, cPlayer, socket);

      layout.updatingBoard(divs.scoreBoard, divs.dotNumBoard, world);

      if (settings.frame % 60 === 0) world.score++;

      if (!world.pause &&
        settings.frame % settings.spawnSpeed === 0 &&
        settings.frame > 100) {
        if (settings.player === 'player1') {
          gameSpawn.spawnDraw(settings, world, false);
          if (settings.player === 'player1' && settings.mode === 'multi') {
            // pass dot list to server.
            console.log(world.dotList);
            socket.emit('pass dotList', settings.oppPlayer, world.dotListInfo);
          }
        }
      }

      if (!world.pause &&
        settings.frame % settings.bonusSpawnSpeed === 0 &&
        settings.frame > 400 &&
        (settings.player === 'player1' || settings.mode === 'single')) {
        gameSpawn.spawnDraw(settings, world, true);
      }

    }

    // anti-cheat.
    if (settings.frame % 180 === 0 && settings.mode === 'single') {
      gameLogic.difficulty(settings, true, window.innerWidth, window.innerHeight);
    }

  }());


  socket.on('get winnerInfo', (cPlayer, rosterArr, status) => {
    world.gameover = true;
    socket.emit('winner gameover', cPlayer, rosterArr, status, world);
  });

  socket.on('draw mouse', (mouseOpp) => {
    mouse.x2 = mouseOpp.x1;
    mouse.y2 = mouseOpp.y1;
  })

  /* Event Listener related */

  const event = gameEvent(settings, world, mouse);

  (function () {
    document.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (settings.mode === 'multi') {
        mouse.x1 = mouse.x - bRect.left;
        mouse.y1 = mouse.y - bRect.top;
        if (settings.frame % 10 === 0) socket.emit('player mouse', settings.oppPlayer, mouse)
      }
    }, false);
    // document.addEventListener('mousemove', event.getMousePos, false);
    if (settings.mode === 'single') {
      document.addEventListener('keydown', event.gamePause, false);
      document.getElementById('gameStart').addEventListener('click', startClick, false);
      document.getElementById('sound').addEventListener('click', event.soundBtn, false);
      document.getElementById('godmode').addEventListener('click', event.godBtn, false);
    }
  }());


};
