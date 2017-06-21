const PlayInfo = require('../models/Play');
const User = require('../models/User');


exports.room = (req, res) => {
  res.render('game/room', {});
};

exports.multiplay = (req, res) => {

};

exports.getScore = (req, res) => {
  PlayInfo
    .find()
    .limit(10)
    .sort('-score')
    .select('name score')
    .exec((err, rank) => {
      const body = JSON.stringify(rank);
      res.setHeader('Content-Type', 'x-application/json');
      res.setHeader('Content-Length', body.length);
      res.end(body);
    })
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
