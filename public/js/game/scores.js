/*
 * Via websockets
 */
  // - codes in gameOver.js
// const scoreSockets = (socket) => {
//
//   socket.on('drawScoreBoard', (data) => {
//
//   });
//
// };

/*
 *Using Ajax
 */

// const postScore = function (data, game) {
//
//   const testData = JSON.stringify({
//     userid: data.id, // user id
//     name: data.name, // scorebord display
//     score: game.score,
//     match: game.match
//   });
//
//   const token = document.querySelector('meta[name="csrf-token"]').content;
//
//   const xhr = new XMLHttpRequest();
//   xhr.open('POST', '/game/post/score', true);
//   xhr.setRequestHeader('Content-Type', 'application/json');
//   xhr.setRequestHeader('X-CSRF-TOKEN', token);
//   xhr.send(testData);
//
// };
//
// const getScoreRank = function (next) {
//
//   const xhr = new XMLHttpRequest();
//
//   xhr.open('GET', '/game/get/score', true);
//   // xhr.open('GET', '/game/get/score', false);
//
//   xhr.onload = function () {
//     if (xhr.status >= 200 && xhr.status < 400) {
//       // Success!
//       res = JSON.parse(xhr.responseText);
//       res = res.slice(0, 5);
//       next(res);
//     } else {
//       // We reached our target server, but it returned an error
//
//     }
//   };
//
//   xhr.onerror = function () {
//     // There was a connection error of some sort
//   };
//   xhr.send();
//
//   // return JSON.parse(xhr.responseText);
// };
