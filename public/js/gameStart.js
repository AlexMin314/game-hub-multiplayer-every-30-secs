const gameStart = function(socket) {

  socket.on('singleplay start', (data) => {
    const container = document.getElementById('mainContainer')
    container.innerHTML = '';
    Game(data, 'single', null, socket);
  });

  socket.on('multiplay start', (data, player) => {
    const container = document.getElementById('mainContainer')
    container.innerHTML = '';
    Game(data, 'multi', player, socket);
  });

};
