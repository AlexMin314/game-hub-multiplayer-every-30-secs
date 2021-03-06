/* Game Starter functions */

const gameSpawn = (function () {

  const gameBoard = document.getElementById('board');
  let rosterArr;

  const trigger = (settings, world, roster, socket) => {

    rosterArr = roster;

    // Remove start screen.
    if (settings.mode === 'single') {
      const wrapper = document.getElementById('wrapper');
      utility.board.removeChild(wrapper);
    }

    world.start = true;

    // Display Score + Dot number.
    layout.boardInfo(world);

    // Initial dot spawn.
    if (settings.mode === 'single') {
      for (var k = 0; k < settings.roundStart; k++) {
        dotSpawner(settings, world, false);
      }
    }

    // Line event triggering.
    if (settings.player === 'player1') {
      setTimeout(() => {
        gameLogic.lineEventTrigger(settings, world, socket);
      }, world.lineEventTimer);
    }

    // 30 Sec checker.
    world.thirtySecBeep = setInterval(function () {
      const beep = document.getElementById('counter');

      if (world.sound) beep.play();

      // Addtional emeny dot spawn every 60 secs.
      world.addChk++;
      if (window.innerWidth > 600 && world.addChk % 2 === 0) settings.roundStartMax++;
    }, world.thirtySec);

  };

  // Dot enemy spawn(bonus: false) | Bonus Spawn(bonus: ture)
  const spawnDraw = (settings, world, bonus, socket) => {
    const leng = bonus ? world.bonusLength : world.dotLength;
    const max = bonus ? settings.bonusMax : settings.roundStartMax;
    const howManyInOneTic = bonus ? settings.bonusSpawn : settings.roundUpSpawn;
    if (leng < max) {
      // Current spawn tic : enemy(1), start(1).
      for (var i = 0; i < howManyInOneTic; i++) {
        dotSpawner(settings, world, bonus);
      }
      if (settings.player === 'player1' && settings.mode === 'multi' && bonus) {
        socket.emit('pass bonusList', settings.oppPlayer, world.bonusInfo);
      }
    }
  };


  // bonus false: enemy dot | true:  bonus star.
  const dotSpawner = (settings, world, bonus) => {
    var arr = bonus ? world.bonus : world.dotList;
    var idx = bonus ? world.bonusIdx : world.dotLength;
    if (!gameLogic.gameOverChk()) {
      arr.push(new Dots(idx, settings, world, bonus))
      bonus ? world.bonusIdx++ : world.dotLength++;
      bonus ? world.bonusLength = arr.length : world.dotLength = arr.length;
    }
  };

  const playerSpawner = (settings, world, player) => {
    world.playerList.push(new Player(settings, world, player));
    world.playerLength = world.playerList.length;
  };

  const lineSpawner = (settings, world, d1, d2, id) => {
    world.line.push(new LineObj(settings, world, d1, d2, id));
  };

  // Create new dots (player, enemy, bonus).
  const createDots = (type, pNum, dNum) => {
    // Make different ID(string) on Dots.
    const divId = type + (type === 'playerDot' ? pNum : dNum);
    // Create and Append the Div.
    const newDiv = utility.appendTo('div', gameBoard, divId)
    newDiv.className = type;
    return document.getElementById(newDiv.id);
  };


  return {
    trigger: trigger,
    lineSpawner: lineSpawner,
    spawnDraw: spawnDraw,
    dotSpawner: dotSpawner,
    playerSpawner: playerSpawner,
    createDots: createDots
  }

}())
