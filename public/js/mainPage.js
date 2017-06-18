(function () {
  const guestPlay = document.getElementById('guestPlay');
  if (guestPlay) {
    guestPlay.addEventListener('click', function (e) {
      location.href = './single';
    });
  }
}());
