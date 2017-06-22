const gameLogic = (function () {

  let gameoverChecker = false;
  let startWidth = 0;
  let startHeight = 0;
  const gameBoard = document.getElementById('board');

  const gameOverChk = () => {
    return gameoverChecker;
  };

  // Collision detection of Player Pattern.
  const collision = function (arr, world, settings, gameOver, bonus, data) {
    // Player coordinate.
    let xThis = Math.floor(this.showInfo().x);
    let yThis = Math.floor(this.showInfo().y);
    let pRadius = Math.floor(this.showInfo().radius);

    // Checking debug mode and game over or not.
    if (!gameoverChecker) {
      arr.map((e, i) => {
        // Target(enemy,bonus) coordinate.
        let xTarget = Math.floor(e.showInfo().x);
        let yTarget = Math.floor(e.showInfo().y);
        let dRadius = Math.floor(e.showInfo().radius);
        let distance = Math.sqrt(Math.pow(xThis - xTarget, 2) + Math.pow(yThis - yTarget, 2));

        // Enemy collision (Circle).
        if (distance < pRadius + dRadius &&
          gameOver === true &&
          bonus === false &&
          !settings.godmode) {
          // Game over.
          gameoverChecker = true;
          gameOverAndResult(settings, world, data);

        }

        // Bonus collision (Circle).
        if (distance < pRadius + dRadius && bonus === true) {
          world.score += world.bonusScore;
          world.bonusCounter++;
          // Remove bonus and play sound.
          removeBonus(e, i, world);
          if (world.sound && world.bonusCounter % 2 === 1) world.star1.play();
          if (world.sound && world.bonusCounter % 2 === 0) world.star2.play();
        }
      }); // map() end.

      // Line(enemy) collision.
      if (world.lineEvent && gameOver === true &&
        !settings.godmode && bonus === false) {
        let dot1X = world.dot1.showInfo().x;
        let dot1Y = world.dot1.showInfo().y;
        let dot2X = world.dot2.showInfo().x;
        let dot2Y = world.dot2.showInfo().y;

        // Distance from player to dot1, dot2.
        let distA = Math.sqrt(Math.pow(dot1X - xThis, 2) + Math.pow(dot1Y - yThis, 2));
        let distB = Math.sqrt(Math.pow(dot2X - xThis, 2) + Math.pow(dot2Y - yThis, 2));

        // Using isosceles triangle case (not accurate but enough).
        let lowerBase = world.line[0].showLine().leng;
        let colRange = 2 * Math.sqrt(Math.pow(lowerBase / 2, 2) + Math.pow(pRadius, 2));
        if (distA + distB < colRange) {
          // Gameover
          gameoverChecker = true;
          gameOverAndResult(settings, world, data);

        }
      }
    }
  }; // colision function end.

  // Removing bonus from the board.
  const removeBonus = (e, i, world) => {
    gameBoard.removeChild(e.showInfo().dots);
    world.bonus.splice(i, 1);
    world.bonusLength = world.bonus.length;
  };

  // Gives wall limit to target(player).
  const wall = function (settings) {
    const rect = this.getBoundingClientRect();
    const r = rect.width / 2;

    const bRect = utility.board.getBoundingClientRect();
    const mode = settings.mode;
    const buffer = settings.bounceBuffer;

    let ww = mode === 'single' ? window.innerWidth : bRect.width;
    ww += bRect.left;
    let hh = mode === 'single' ? window.innerHeight : bRect.height;
    hh += bRect.top;

    const w = Math.floor(ww);
    const h = Math.floor(hh);
    // Wall condition.
    if (rect.bottom > h) this.style.top = (h - rect.height) + 'px';
    if (rect.top < bRect.top + buffer) this.style.top = bRect.top + 'px';
    if (rect.left < bRect.left + buffer) this.style.left = bRect.left + 'px';
    if (rect.right > w) this.style.left = (w - rect.width) + 'px';
  };

  // Line event trigger.
  const lineEventTrigger = (settings, world) => {

    // Append line div
    const lineDiv = utility.appendTo('div', gameBoard, 'line');

    // pick 2 dots.
    let dotIdx1 = Math.floor(Math.random() * world.dotLength);
    let dotIdx2 = Math.floor(Math.random() * world.dotLength);
    while (dotIdx1 === dotIdx2) dotIdx2 = Math.floor(Math.random() * world.dotLength);
    world.dot1 = world.dotList[dotIdx1];
    world.dot2 = world.dotList[dotIdx2];

    // triggering
    world.lineEvent = true;

    // Spawning.
    gameSpawn.lineSpawner(settings, world, world.dot1, world.dot2, 'line');
  };

  // Game diffculty setting + anti-cheat.
  const difficulty = (settings, start, width, height) => {

    const bRect = utility.board.getBoundingClientRect();
    const mode = settings.mode;

    const divider = 300;
    const dotN = 3;

    // Set init width,height before game start.
    if (!start) {
      sWidth = mode === 'single' ? width : bRect.width;
      sHeight = mode === 'single' ? height : bRect.height;
      let multi = Math.floor(width / divider) + 1;
      //settings.roundStart = multi;
      // settings.roundStartMax = multi * dotN;
    }

    // Detecting changes on resolution after game start.
    if (start && (sWidth !== width || sHeight !== height)) {
      let multi = Math.floor(width / divider) + 1;
      //settings.roundStart = multi;
      settings.roundStartMax = multi * dotN;
      if (width <= 600 && height < 600) {
        //settings.roundStart = multi - dotN;
        settings.roundStartMax = multi * dotN - dotN;
      }
      if (width <= 600 && height > 600) {
        //settings.roundStart = multi + dotN;
        settings.roundStartMax = multi * dotN + dotN;
      }
      sWidth = width;
      sHeight = height;
    }
  };


  return {
    gameOverChk: gameOverChk,
    collision: collision,
    wall: wall,
    lineEventTrigger: lineEventTrigger,
    difficulty: difficulty
  }

}());
