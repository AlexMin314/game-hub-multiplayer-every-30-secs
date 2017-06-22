/* Game Starter functions */

const gameSpawn = (function () {

  const gameBoard = document.getElementById('board');

  const trigger = (settings, world) => {
    // Remove start screen.
    if (settings.mode === 'single') {
      const wrapper = document.getElementById('wrapper');
      gameBoard.removeChild(wrapper);
    }

    world.start = true;

    // Display Score + Dot number.
    layout.boardInfo(world);

    // Initial dot spawn.
    for (var k = 0; k < settings.roundStart; k++) {
      dotSpawner(settings, world, false);
    }

    // Line event triggering.
    setTimeout(() => {
      gameLogic.lineEventTrigger(settings, world);
    }, world.lineEventTimer);

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
  const spawnDraw = (settings, world, bonus) => {
    const leng = bonus ? world.bonusLength : world.dotLength;
    const max = bonus ? settings.bonusMax : settings.roundStartMax;
    const howManyInOneTic = bonus ? settings.bonusSpawn : settings.roundUpSpawn;
    if (leng < max) {
      // Current spawn tic : enemy(1), start(1).
      for (var i = 0; i < howManyInOneTic; i++) {
        dotSpawner(settings, world, bonus);
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

  const playerSpawner = (settings, world) => {
    world.playerList.push(new Player(settings, world));
    world.playerLength = world.playerList.length;
  };

  const lineSpawner = (settings, world, x1, y1, x2, y2, id) => {
    world.line.push(new LineObj(settings, world, x1, y1, x2, y2, id));
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
