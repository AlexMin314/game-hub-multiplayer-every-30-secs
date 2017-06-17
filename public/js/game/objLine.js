// Line event - drawing line
var LineObj = function (settings, world, dot1, dot2, id) {

  var lineLength = 0;
  var lineDiv = document.getElementById(id);

  this.drawLineMove = function () {

    var x1 = dot1.showInfo().x;
    var y1 = dot1.showInfo().y;
    var x2 = dot2.showInfo().x;
    var y2 = dot2.showInfo().y;

    // Calculate angle to rotate line div.
    var calc = Math.atan2(y2 - y1, x2 - x1);
    calc = calc * 180 / Math.PI;

    // Line length(distance between the dot1 dot2).
    lineLength = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));

    if (!gameOverChk()) {
      lineDiv.style.height = '2px';
      lineDiv.style.width = lineLength + 'px';
      lineDiv.style.backgroundColor = 'red';
      lineDiv.style.position = 'absolute';
      lineDiv.style.top = y1 + 'px';
      lineDiv.style.left = x1 + 'px';
      lineDiv.style.transform = 'rotate(' + calc + 'deg)';
      lineDiv.style.transformOrigin = '0%';
      lineDiv.style['-webkit-transform'] = 'rotate(' + calc + 'deg)';
      lineDiv.style['-webkit-transform-origin'] = '0% 0%';
      lineDiv.style['-ms-transform'] = 'rotate(' + calc + 'deg)';
    }
  };

  this.showLine = function() {
    return {
      leng: lineLength
    }
  };
};
