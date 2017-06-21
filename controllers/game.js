exports.singleMain = (req, res) => {
  res.render('game/single', {
  });
};

exports.room = (req, res) => {
  res.render('game/room', {
  });
};


exports.singleMainLogin = (req, res) => {

};
exports.multiplay = (req, res) => {

};

exports.rank = (req, res) => {
  res.render('home', {
  });
};


exports.getScore = (req, res) => {
  console.log('==========' + req.body);
  console.log('==========' + req.params);
  console.log('==========' + req.params.name);
  console.log('==========' + req.body.name);
  res.render('home', {
  });
};

exports.postScore = (req, res) => {
  res.render('home', {
  });
  console.log(req.params);
};
