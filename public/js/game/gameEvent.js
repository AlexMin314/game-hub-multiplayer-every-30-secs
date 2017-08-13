const gameEvent = (settings, world, mouse) => {

  /* Event Listener related */

  return {
    soundBtn: function (e) {
      if (world.sound) world.clickSound.play();
      world.sound = !(world.sound);
      layout.soundOnOff(world);
      utility.bgSound(world);
    },

    godBtn: function (e) {
      if (world.sound) world.clickSound.play();
      settings.godmode = !(settings.godmode);
      layout.godOnOff(settings);
    },

    // press spaceBar = pause
    gamePause: function (e) {
      if (e.keyCode === 32 && world.pauseLimit > 0 && world.start) {
        if (world.sound) world.clickSound.play();
        world.pause = !world.pause;
        world.pauseLimit -= 0.5;
        layout.gamePause(world);
      }
    }

  }; // return ends here.

};
