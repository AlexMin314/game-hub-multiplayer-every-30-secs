const Player = function (settings, world) {
  // Settings
  let playerDot = null;
  let playerNum = 1;
  let pX = 0;
  let pY = 0;
  let pRadius = 0;

  // Initiation.
  (function () {
    // Create Player dot.
    playerDot = gameSpawn.createDots('playerDot', playerNum);

    // Starting Point : Center
    pRadius = playerDot.getBoundingClientRect().width / 2;
    playerDot.style.top = Math.floor(window.innerHeight / 2 - pRadius) + 'px';
    playerDot.style.left = Math.floor(window.innerWidth / 2 - pRadius) + 'px';
  }());

  // Draw Player move
  this.drawPlayerMove = function (mouse) {
    // Sync current position.
    const pRect = playerDot.getBoundingClientRect();
    pX = pRect.left;
    pY = pRect.top;

    // Reducing approach speed when the cursor and playerDot are closer.
    let nextX = pX + (mouse.x - 25 - pX) / settings.playerDotSpeed;
    let nextY = pY + (mouse.y - 25 - pY) / settings.playerDotSpeed;

    //if (nextX < )

    // Set new Coordinates for next frame.
    playerDot.style.left = nextX + "px";
    playerDot.style.top = nextY + "px";

    // Set wall boundary to player controller
    gameLogic.wall.call(playerDot, settings);
  };

  // Return Coordinate for public usage
  this.showInfo = function () {
    return {
      x: pX + pRadius,
      y: pY + pRadius,
      radius: pRadius
    };
  };

};
