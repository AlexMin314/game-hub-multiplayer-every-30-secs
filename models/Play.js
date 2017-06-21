const mongoose = require('mongoose');

const playSchema = new mongoose.Schema({

  userid: String, // user id
  name: String, // scorebord display
  score: Number,
  match: String // single, win, lose

}, { timestamps: true });

const PlayInfo = mongoose.model('PlayInfo', playSchema);

module.exports = PlayInfo;
