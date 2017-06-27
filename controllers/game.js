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
    if (err) { return next(err); }
    user.game.play.push(playInfo);
    user.game.exp += data.score;
    user.game.level = Math.floor(user.game.exp / 3000) + 1;
    user.game.progress = Math.floor((user.game.exp % 3000) / 30);
    if(data.match === 'win') user.game.win++;
    if(data.match === 'lose') user.game.lose++;
    if(data.match === 'single') user.game.single++;
    user.game.total = user.game.win + user.game.lose;
    if(data.score > user.game.top) user.game.top = data.score;

    // user.game.top = user.game.play
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
    });
};
