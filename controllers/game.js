const PlayInfo = require('../models/Play');
const User = require('../models/User');

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

};

exports.postScore = (req, res, next) => {

  const playInfo = new PlayInfo({
    userid: req.body.userid, // user id
    name: req.body.name, // scorebord display
    score: req.body.score,
    match: req.body.match // singleplay(0), win(1), lose(0)
  });

  playInfo.save();

  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); };
    user.game.play.push(playInfo);
    user.save();
  });

};
