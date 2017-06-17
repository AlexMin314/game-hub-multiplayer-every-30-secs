var eventFunc = function (settings, world, mouse, divs) {

  /* Event Listener related */

  return {

    getMousePos: function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    },

    soundButton: function (e) {
      if (world.sound) world.clickSound.play();
      world.sound = !(world.sound);
      soundOnOff(world);
      backgroundSound(world);
    },

    godButton: function (e) {
      if (world.sound) world.clickSound.play();
      settings.godmode = !(settings.godmode);
      godOnOff(settings);
    },

    // press spaceBar = pause
    gamePause: function (e) {
      if (e.keyCode === 32 && world.pauseLimit > 0 && world.start) {
        if (world.sound) world.clickSound.play();
        world.pause = !world.pause;
        world.pauseLimit -= 0.5;
        gamePauseScreen(world);
      }
    }

  }; // return ends here.

};
