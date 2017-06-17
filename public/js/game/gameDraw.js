/* Drawing related in render loop */

// Draw movement of player and dots.
var drawMovements = function (settings, world, mouse) {
  // player movement + collision detection.
  world.playerList.map(function (e, i, arr) {
    collision.call(e, world.dotList, world, settings, true, false);
    collision.call(e, world.bonus, world, settings, true, true);
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
    world.line.map(function(e) {
      return e.drawLineMove();
    });
  }

};
