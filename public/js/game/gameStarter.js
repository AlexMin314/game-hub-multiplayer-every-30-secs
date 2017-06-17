/* Game Starter functions */

var gameStarter = function (settings, world) {
  // Remove start screen.
  document.getElementById('board').removeChild(utility().wrapper);
  world.start = true;

  // Display Score + Dot number.
  boardInfo(world);

  // Initial dot spawn.
  for (var k = 0; k < settings.roundStart; k++) {
    dotSpawner(settings, world, false);
  }

  // Dot spwan.
  setInterval(function () {
    if (!world.pause) spawnStart(settings, world, false);
  }, settings.spawnSpeed);

  // Bonuse spwan.
  setInterval(function () {
    if (!world.pause) spawnStart(settings, world, true);
  }, settings.bonusSpawnSpeed);

  // Line event triggering.
  setTimeout(function () {
    lineEventTrigger(settings, world);
  }, world.lineEventTimer);

  // 30 Sec checker.
  world.thirtySecBeep = setInterval(function () {
    utility().countBeep.play();
    // Speed Scale effective on only new spawn dot.
    settings.speedScale += 0.05;
    // Addtional emeny dot spawn every 60 secs.
    world.addChk++;
    if (window.innerWidth > 600 && world.addChk % 2 === 0) settings.roundStartMax++;
  }, world.thirtySec);

  // Score Tracking.
  setInterval(function () {
    world.score++;
  }, 1000)
};

// Dot enemy spawn(bonus: false) | Bonus Spawn(bonus: ture)
var spawnStart = function (settings, world, bonus) {
  var leng = bonus ? world.bonusLength : world.dotLength;
  var max = bonus ? settings.bonusMax : settings.roundStartMax;
  var howManyInOneTic = bonus ? settings.bonusSpawn : settings.roundUpSpawn;
  if (leng < max) {
    // Current spawn tic : enemy(1), start(1).
    for (var i = 0; i < howManyInOneTic; i++) {
      dotSpawner(settings, world, bonus);
    }
  }
};


// bonus false: enemy dot | true  bonus star.
var dotSpawner = function (settings, world, bonus) {
  var arr = bonus ? world.bonus : world.dotList;
  var idx = bonus ? world.bonusIdx : world.dotLength;
  if (!gameOverChk()) {
    arr.push(new Dots(idx, settings, world, bonus))
    bonus ? world.bonusIdx++ : world.dotLength++;
    bonus ? world.bonusLength = arr.length : world.dotLength = arr.length;
  }
};

var playerSpawner = function(settings, world) {
  world.playerList.push(new Player(settings, world));
  world.playerLength = world.playerList.length;
};

var lineSpawner = function(settings, world, x1, y1, x2, y2, id) {
  world.line.push(new LineObj(settings, world, x1, y1, x2, y2, id));
};

// Create new dots (player, enemy, bonus).
var createDots = function (type, pNum, dNum) {
  // Make different ID(string) on Dots.
  var divId = type + (type === 'playerDot' ? pNum : dNum);
  // Create and Append the Div.
  var newDiv = utility().appendTo('div', utility().gameBoard, divId)
  newDiv.className = type;
  return document.getElementById(newDiv.id);
};
