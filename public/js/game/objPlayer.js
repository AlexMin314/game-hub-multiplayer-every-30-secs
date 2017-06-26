const Player = function (settings, world, playerNum) {
  // Settings
  let playerDot = null;
  let pX = 0;
  let pY = 0;
  let pRadius = 0;
  const pNum = playerNum;
  const mode = settings.mode;
  const socket = settings.socket;
  const bRect = document.getElementById('board').getBoundingClientRect();

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

    let mouseX = pNum === 1 ? mouse.x : mouse.x2 + bRect.left;
    let mouseY = pNum === 1 ? mouse.y : mouse.y2 + bRect.top;

    // Reducing approach speed when the cursor and playerDot are closer.
    const nextX = pX + (mouseX - 25 - pX) / settings.playerDotSpeed;
    const nextY = pY + (mouseY - 25 - pY) / settings.playerDotSpeed;

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
