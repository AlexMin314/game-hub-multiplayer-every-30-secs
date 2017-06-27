/* Drawing related in render loop */
    let test = 0;
// Draw movement of player and dots.
const drawMovements = (settings, world, mouse, curPlayer, socket) => {
  // player movement + collision detection.
  if (!world.gameover) {

    // gameLogic.collision.call(world.playerList[0], world.dotList, world, settings, true, false, curPlayer, settings.pList);
    // gameLogic.collision.call(world.playerList[0], world.bonus, world, settings, true, true, curPlayer, settings.pList);

    world.playerList[0].drawPlayerMove(mouse);
    if (settings.mode === 'multi') world.playerList[1].drawPlayerMove(mouse);

    // dot(enemy) movement.
    //if (settings.player === 'player1' || settings.mode === 'single') {
      world.dotList.forEach(function (e) {
        e.drawDotMove();
      });
    //}

    // need dot init here.
    if (settings.player === 'player2' && test < world.dotListInfo.length) {
      console.log('here')
      test = world.dotListInfo.length;
      const index = world.dotListInfo.length - 1;

      const mInfo = world.dotListInfo[world.dotListInfo.length - 1];
      world.dotList.push(new Dots(index, settings, world, false, mInfo));

    }


    if (settings.player === 'player1') { // temp condition for the test.
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

  }

};
