const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  gameTotal: Array // store entire play/matches
}, { timestamps: true });

const GameInfo = mongoose.model('GameInfo', gameSchema);

module.exports = GameInfo;
