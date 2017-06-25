const Dots = function (dotNum, settings, world, bonus) {

  // Settings
  let dots = null;
  let x = 0;
  let y = 0;
  let radius = 0;

  // Speed/Direction Seed randomizing.
  const speedX = Math.floor(Math.random() * 4 + 2);
  const speedY = Math.floor(Math.random() * 4 + 2);
  const mult = settings.speedScale;

  // Starting Vector randomizing.
  let dx = Math.random() > 0.5 ? speedX * mult : -speedX * mult;
  let dy = Math.random() > 0.5 ? speedY * mult : -speedY * mult;

  // Initiation.
  (function () {
    // Create an enemy dot.
    dots = bonus ?
      gameSpawn.createDots('bonus', null, dotNum) :
      gameSpawn.createDots('dots', null, dotNum);

    // distance from the center
    const d = world.spawnDist;
    const bRect = utility.board.getBoundingClientRect();

    const mode = settings.mode;
    console.log(mode);
    let bw = mode === 'single' ? window.innerHeight : bRect.width;
    let bh = mode === 'single' ? window.innerWidth : bRect.height;

    // Starting Point : random, avoid center(player protection)
    const downside = bh - d - 10;//Math.random() * (bh / d) + (bh * (d - 1) / d) - 70;
    const upside = bRect.top + d + 10;//Math.random() * (bh / d) + 70;
    const randomSeed = Math.random() * 2 < 1 ? upside : downside;
    dots.style.top = Math.floor(randomSeed) + 'px';
    dots.style.left = Math.floor(Math.random() * (bw - 300) + 150 + bRect.left) + 'px';

    // coloring
    if (!bonus) dots.style.backgroundColor = world.colorSeed[speedX];
    if (bonus) dots.innerHTML = '<i class="fa fa-star fa-spin"></i>';
  }());

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
