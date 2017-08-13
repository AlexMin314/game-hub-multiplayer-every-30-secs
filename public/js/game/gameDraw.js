/* Drawing related in render loop */

// Draw movement of player and dots.
const drawMovements = (settings, world, mouse, curPlayer, socket) => {
  // player movement + collision detection.
  if (!world.gameover) {

    gameLogic.collision.call(world.playerList[0], world.dotList, world, settings, true, false, curPlayer, settings.pList, socket);
    gameLogic.collision.call(world.playerList[0], world.bonus, world, settings, true, true, curPlayer, settings.pList, socket);

    world.playerList[0].drawPlayerMove(mouse);
    if (settings.mode === 'multi') world.playerList[1].drawPlayerMove(mouse);

    // dot(enemy) movement.
    world.dotList.forEach(function (e) {
      e.drawDotMove();
    });

    // need dot init here.
    if (settings.player === 'player2' && world.dotcount < world.dotListInfo.length) {
      world.dotcount = world.dotListInfo.length;
      const index = world.dotListInfo.length - 1;
      const mInfo = world.dotListInfo[world.dotListInfo.length - 1];

      mInfo.mleft += (world.timeGap * settings.FPS * mInfo.mdx) / 1000;
      mInfo.mtop += (world.timeGap * settings.FPS * mInfo.mdy) / 1000;

      world.dotList.push(new Dots(index, settings, world, false, mInfo));
      world.dotLength = world.dotList.length;
    }
    //
    if (settings.player === 'player2' && world.bonusChk) {
      const index1 = world.bonusIdx;
      const mInfo1 = world.bonusInfo[world.bonusInfo.length - 1];
      world.bonus.push(new Dots(index1, settings, world, true, mInfo1));
      world.bonusIdx++;
      world.bonusLength = world.bonus.length;
      world.bonusChk = false;
    }

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
