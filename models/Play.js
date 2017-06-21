const mongoose = require('mongoose');

const playSchema = new mongoose.Schema({

  userid: String, // user id
  name: String, // scorebord display
  score: Number,
  match: Number // singleplay(0), win(1), lose(0)
  
}, { timestamps: true });

const PlayInfo = mongoose.model('PlayInfo', playSchema);

module.exports = PlayInfo;
