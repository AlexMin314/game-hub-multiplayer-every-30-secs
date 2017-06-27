const Dots = function (dotNum, settings, world, bonus, mData) {

  // Settings
  let dots = null;
  let x = 0;
  let y = 0;
  let radius = 0;
  let dx;
  let dy;
  let topCoord;
  let leftCoord;
  const bRect = utility.board.getBoundingClientRect();

  if (settings.player === 'player1') {
    // Speed/Direction Seed randomizing.
    const speedX = Math.floor(Math.random() * 4 + 2);
    const speedY = Math.floor(Math.random() * 4 + 2);
    const mult = settings.speedScale;

    // Starting Vector randomizing.
    dx = Math.random() > 0.5 ? speedX * mult : -speedX * mult;
    dy = Math.random() > 0.5 ? speedY * mult : -speedY * mult;

    // Initiation.
    (function () {
      // Create an enemy dot.
      dots = bonus ?
        gameSpawn.createDots('bonus', null, dotNum) :
        gameSpawn.createDots('dots', null, dotNum);

      // distance from the center
      const d = world.spawnDist;
      //const bRect = utility.board.getBoundingClientRect();

      const mode = settings.mode;
      const bw = mode === 'single' ? window.innerHeight : bRect.width;
      const bh = mode === 'single' ? window.innerWidth : bRect.height;

      // Starting Point : random, avoid center(player protection)
      const downside = bh - d;
      const upside = bRect.top + 10 + Math.floor(Math.random() * (d / 2));
      const randomSeed = Math.random() * 2 < 1 ? upside : downside;
      topCoord = Math.floor(randomSeed);
      leftCoord = Math.floor(Math.random() * (bw - 150) + 75 + bRect.left);
      dots.style.top = topCoord + 'px';
      dots.style.left = leftCoord + 'px';

      // coloring
      if (!bonus) dots.style.backgroundColor = world.colorSeed[speedX];
      if (bonus) dots.innerHTML = '<i class="fa fa-star fa-spin"></i>';
    }());
  }
  if (settings.player === 'player2' && settings.mode === 'multi') {
    // Starting Vector randomizing.
    dx = mData.mdx;
    dy = mData.mdy;

    // Initiation.
    (function () {
      // Create an enemy dot.
      dots = bonus ?
        gameSpawn.createDots('bonus', null, dotNum) :
        gameSpawn.createDots('dots', null, dotNum);

      dots.style.top = mData.mtop + bRect.top + 'px';
      dots.style.left = mData.mleft + bRect.left + 'px';

      // coloring
      if (!bonus) dots.style.backgroundColor = mData.bgc;
      if (bonus) dots.innerHTML = '<i class="fa fa-star fa-spin"></i>';
    }());
  }

  // multiplayer info
  if (settings.mode === 'multi' && settings.player === 'player1') {
    const mInfo = {};
    mInfo.mdx = dx;
    mInfo.mdy = dy;
    mInfo.mtop = topCoord - bRect.top;
    mInfo.mleft = leftCoord - bRect.left;
    if (!bonus) {
      mInfo.bgc = dots.style.backgroundColor;
      mInfo.bonus = false;
    }
    if (bonus) mInfo.bonus = true;

    if (!bonus) world.dotListInfo.push(mInfo);
    if (bonus) world.bonusInfo.push(mInfo);
  }

  // Drawing dot movement
  this.drawDotMove = function () {
    const dRect = dots.getBoundingClientRect();
    x = dRect.left;
    y = dRect.top;
    radius = dRect.width / 2;

    const bRect = utility.board.getBoundingClientRect();

    const mode = settings.mode;
    let bWidth = mode === 'single' ? window.innerWidth : bRect.width;
    bWidth += bRect.left;
    let bHeight = mode === 'single' ? window.innerHeight : bRect.height;
    bHeight += bRect.top;

    // Wall bouncing
    if (x + dx > bWidth - dRect.width - settings.bounceBuffer) {
      dx = -dx;
      x = bWidth - dRect.width - settings.bounceBuffer;
    }
    if (y + dy > bHeight - dRect.width - settings.bounceBuffer) {
      dy = -dy;
      y = bHeight - dRect.width - settings.bounceBuffer;
    }
    if (x + dx < settings.bounceBuffer + bRect.left) dx = -dx;
    if (y + dy < settings.bounceBuffer + bRect.top) dy = -dy;
    x += dx;
    y += dy;
    dots.style.left = x + 'px';
    dots.style.top = y + 'px';
  };

  // Return Coordinate for public usage
  this.showInfo = function () {
    return {
      x: x + radius,
      y: y + radius,
      radius: radius,
      dots: dots
    };
  };

};
