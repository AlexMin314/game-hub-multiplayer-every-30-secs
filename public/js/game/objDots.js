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
    const h = window.innerHeight;
    const w = window.innerWidth;

    // Starting Point : random, avoid center(player protection)
    const downside = Math.random() * (h / d) + (h * (d - 1) / d) - 70;
    const upside = Math.random() * (h / d) + 70;
    const randomSeed = Math.random() * 2 < 1 ? upside : downside;
    dots.style.top = Math.floor(randomSeed) + 'px';
    dots.style.left = Math.floor(Math.random() * (w - 150) + 75) + 'px';

    // coloring
    if (!bonus) dots.style.backgroundColor = world.colorSeed[speedX];
    if (bonus) dots.innerHTML = '<i class="fa fa-star fa-spin"></i>';
  }());

  // Drawing dot movement
  this.drawDotMove = function () {
    var dRect = dots.getBoundingClientRect();
    x = dRect.left;
    y = dRect.top;
    radius = dRect.width / 2;

    // Wall bouncing
    if (x + dx > window.innerWidth - dRect.width - settings.bounceBuffer) {
      dx = -dx;
      x = window.innerWidth - dRect.width - settings.bounceBuffer;
    }
    if (y + dy > window.innerHeight - dRect.width - settings.bounceBuffer) {
      dy = -dy;
      y = window.innerHeight - dRect.width - settings.bounceBuffer;
    }
    if (x + dx < settings.bounceBuffer) dx = -dx;
    if (y + dy < settings.bounceBuffer) dy = -dy;
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
