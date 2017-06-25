const PlayInfo = require('../models/Play');
const User = require('../models/User');


/**
 * Socket ways...
 */
exports.postScoreSocket = (data) => {

  const playInfo = new PlayInfo({
    userid: data.id, // user id
    name: data.name, // scorebord display
    score: data.score,
    match: data.match // singleplay(0), win(1), lose(0)
  });

  playInfo.save();

  User.findById(data.id, (err, user) => {
    if (err) { return next(err); };
    user.game.play.push(playInfo);
    user.save();
  });

};

exports.getScoreSocket = (next) => {
  PlayInfo
    .find()
    .limit(10)
    .sort('-score')
    .select('name score')
    .exec((err, rank) => {
      next(rank);
    })
};
