const gameStart = function(socket) {

  socket.on('singleplay start', (data) => {
    const container = document.getElementById('mainContainer')
    container.innerHTML = '';
    Game(data, 'single');
  });

};
