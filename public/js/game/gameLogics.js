(function () {
  /* Game Logics */

  var gameoverChecker = false;
  var startWidth = 0;
  var startHeight = 0;

  this.gameOverChk = function () {
    return gameoverChecker;
  };

  // Collision detection of Player Pattern.
  this.collision = function (arr, world, settings, gameOver, bonus) {
    // Player coordinate.
    var xThis = Math.floor(this.showInfo().x);
    var yThis = Math.floor(this.showInfo().y);
    var pRadius = Math.floor(this.showInfo().radius);

    // Checking debug mode and game over or not.
    if (!gameoverChecker) {
      arr.map(function (e, i) {
        // Target(enemy,bonus) coordinate.
        var xTarget = Math.floor(e.showInfo().x);
        var yTarget = Math.floor(e.showInfo().y);
        var dRadius = Math.floor(e.showInfo().radius);
        var distance = Math.sqrt(Math.pow(xThis - xTarget, 2) + Math.pow(yThis - yTarget, 2));

        // Enemy collision (Circle).
        if (distance < pRadius + dRadius &&
          gameOver === true &&
          bonus === false &&
          !settings.godmode) {
          // Game over.
          gameoverChecker = true;
          gameOverAndResult(world);
        }

        // Bonus collision (Circle).
        if (distance < pRadius + dRadius && bonus === true) {
          world.score += world.bonusScore;
          world.bonusCounter++;
          // Remove bonus and play sound.
          removeBonus(e, i, world);
          if (world.sound && world.bonusCounter % 2 === 1) utility().starE1.play();
          if (world.sound && world.bonusCounter % 2 === 0) utility().starE2.play();
        }
      });

      // Line(enemy) collision.
      if (world.lineEvent && gameOver === true &&
        !settings.godmode && bonus === false) {
        var dot1X = world.dot1.showInfo().x;
        var dot1Y = world.dot1.showInfo().y;
        var dot2X = world.dot2.showInfo().x;
        var dot2Y = world.dot2.showInfo().y;

        // Distance from player to dot1, dot2.
        var distA = Math.sqrt(Math.pow(dot1X - xThis, 2) + Math.pow(dot1Y - yThis, 2));
        var distB = Math.sqrt(Math.pow(dot2X - xThis, 2) + Math.pow(dot2Y - yThis, 2));

        // Using isosceles triangle case (not accurate but enough).
        var lowerBase = world.line[0].showLine().leng;
        var colRange = 2 * Math.sqrt(Math.pow(lowerBase / 2, 2) + Math.pow(pRadius, 2));
        if (distA + distB < colRange) {
          // Gameover
          gameoverChecker = true;
          gameOverAndResult(world);
        }
      }
    }
  }; // colision function end.

  // Removing bonus from the board.
  this.removeBonus = function (e, i, world) {
    utility().gameBoard.removeChild(e.showInfo().dots);
    world.bonus.splice(i, 1);
    world.bonusLength = world.bonus.length;
  }

  // Gives wall limit to target(player).
  this.wall = function () {
    var rect = this.getBoundingClientRect();
    var w = Math.floor(window.innerWidth);
    var h = Math.floor(window.innerHeight);
    // Wall condition.
    if (rect.bottom > h) this.style.top = (h - rect.height) + 'px';
    if (rect.top < 0) this.style.top = '0px';
    if (rect.left < 0) this.style.left = '0px';
    if (rect.right > w) this.style.left = (w - rect.width) + 'px';
  }

  // Line event trigger.
  this.lineEventTrigger = function (settings, world) {
    // Append line div
    var lineDiv = utility().appendTo('div', utility().gameBoard, 'line');

    // pick 2 dots.
    var dotIdx1 = Math.floor(Math.random() * world.dotLength);
    var dotIdx2 = Math.floor(Math.random() * world.dotLength);
    while (dotIdx1 === dotIdx2) dotIdx2 = Math.floor(Math.random() * world.dotLength);
    world.dot1 = world.dotList[dotIdx1];
    world.dot2 = world.dotList[dotIdx2];

    // triggering
    world.lineEvent = true;

    // Spawning.
    lineSpawner(settings, world, world.dot1, world.dot2, 'line');
  };

  // Game diffculty setting + anti-cheat.
  this.difficulty = function (settings, start, width, height) {
    var divider = 300;
    var dotN = 3;

    // Set init width,height before game start.
    if (!start) {
      startWidth = width;
      startHeight = height;
      var multi = Math.floor(width / divider) + 1;
      settings.roundStart = multi;
      settings.roundStartMax = multi * dotN;
    }

    // Detecting changes on resolution after game start.
    if (start && (startWidth !== width || startHeight !== height)) {
      var multi = Math.floor(width / divider) + 1;
      settings.roundStart = multi;
      settings.roundStartMax = multi * dotN;
      if (width <= 600 && height < 600) {
        settings.roundStart = multi - dotN;
        settings.roundStartMax = multi * dotN - dotN;
      }
      if (width <= 600 && height > 600) {
        settings.roundStart = multi + dotN;
        settings.roundStartMax = multi * dotN + dotN;
      }
      startWidth = width;
      startHeight = height;
    }
  };

}());
