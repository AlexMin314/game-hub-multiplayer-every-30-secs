const postScore = function (data, game, guest) {

  if (!guest) {
    const testData = JSON.stringify({
      userid: data.id, // user id
      name: data.name, // scorebord display
      score: game.score,
      match: game.match
    });

    const token = document.querySelector('meta[name="csrf-token"]').content;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/game/post/score', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-CSRF-TOKEN', token);
    xhr.send(testData);
  }

};
