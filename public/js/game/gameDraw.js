/* Drawing related in render loop */

// Draw movement of player and dots.
const drawMovements = (settings, world, mouse, curPlayer, rosterArr) => {
  // player movement + collision detection.
  if (!world.gameover) {
    world.playerList.map(function (e, i, arr) {
      gameLogic.collision.call(e, world.dotList, world, settings, true, false, curPlayer, rosterArr);
      gameLogic.collision.call(e, world.bonus, world, settings, true, true, curPlayer, rosterArr);
      return e.drawPlayerMove(mouse);
    });

    // dot(enemy) movement.
    world.dotList.map(function (e) {
      return e.drawDotMove();
    });

    // bonus(star) movement.
    world.bonus.map(function (e) {
      return e.drawDotMove();
    });

    // line(enemy) movement.
    if (world.lineEvent) {
      world.line.map(function (e) {
        return e.drawLineMove();
      });
    }
  }

};
