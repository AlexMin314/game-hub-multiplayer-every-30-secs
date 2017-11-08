const gameStart = function(socket) {

  socket.on('singleplay start', (curPlayer) => {
    const container = document.getElementById('mainContainer')
    container.innerHTML = '';
    Game(curPlayer, 'single', null, socket);
  });

  socket.on('multiplay start', (curPlayer, rosterArr) => {
    const container2 = document.getElementById('mainContainer')
    container.innerHTML = '';
    Game(curPlayer, 'multi', rosterArr, socket);
  });
  // socket.on('multiplay start', (curPlayer, rosterArr) => {
  //   const container = document.getElementById('mainContainer')
  //   container.innerHTML = '';
  //   Game(curPlayer, 'multi', rosterArr, socket);
  // });

};
