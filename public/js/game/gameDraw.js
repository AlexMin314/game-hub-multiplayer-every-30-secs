/* Drawing related in render loop */

// Draw movement of player and dots.
const drawMovements = (settings, world, mouse, curPlayer) => {
  // player movement + collision detection.
  if (!world.gameover) {
    // world.playerList.forEach((e) => {
      gameLogic.collision.call(world.playerList[0], world.dotList, world, settings, true, false, curPlayer, settings.pList);
      gameLogic.collision.call(world.playerList[0], world.bonus, world, settings, true, true, curPlayer, settings.pList);
      world.playerList[0].drawPlayerMove(mouse);
      world.playerList[1].drawPlayerMove(mouse);
    // world.playerList.forEach((e) => {
    //   gameLogic.collision.call(e, world.dotList, world, settings, true, false, curPlayer, settings.pList);
    //   gameLogic.collision.call(e, world.bonus, world, settings, true, true, curPlayer, settings.pList);
    //   e.drawPlayerMove(mouse);
    // });

    // dot(enemy) movement.
    world.dotList.forEach(function (e) {
      e.drawDotMove();
    });

    // bonus(star) movement.
    world.bonus.forEach(function (e) {
      e.drawDotMove();
    });

    // line(enemy) movement.
    if (world.lineEvent) {
      world.line.forEach(function (e) {
        e.drawLineMove();
      });
    }
  }

};
