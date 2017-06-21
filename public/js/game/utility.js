const utility = (function () {

  // Caching div info.
  let divInfo = {};
  divInfo.gameBoard = document.getElementById('board');
  divInfo.pause = document.getElementById('pause');


  /* Helper functions */

  // Wrapper as a helper.
  const makeWrapper = () => {
    const wrapperDiv = appendTo('div', divInfo.gameBoard, 'wrapper');
  }

  // Append helper
  const appendTo = (type, parent, id) => {
    const newDiv = document.createElement(type);
    newDiv.id = id || 'tempId';
    parent.appendChild(newDiv);
    return newDiv;
  };

  // Audio tag helper
  const audioTagHelper = (id, src, loop, auto, volume) => {
    const audioTag = appendTo('audio', divInfo.gameBoard, id);
    audioTag.src = src;
    audioTag.loop = loop;
    audioTag.autoplay = auto;
    audioTag.volume = volume || 1;
  };

  // Tutorial helper
  const startCountBeep = (world, target, num) => {
    const beep = document.getElementById('counter');
    if (world.sound) beep.play(); // need to change
    target.innerHTML = num;
  };

  // Appending background sound, game over.
  const backgroundSound = (world, gameOver) => {
    if (!gameOver && world.sound) audioTagHelper('bgSound', './src/bg.mp3', true, true, 0.2);
    if (gameOver && world.sound) audioTagHelper('bgSound', './src/over.mp3', false, true, 0.4);
    // Mute.
    if (!world.sound) divInfo.gameBoard.removeChild(document.getElementById('bgSound'));
  };

  /* Cross browsing */

  window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / settings.FPS);
      };
  }());

  return {
    appendTo: appendTo,
    audio: audioTagHelper,
    bgSound: backgroundSound,
    makeWrapper: makeWrapper,
    startCountBeep: startCountBeep
  }

}());
