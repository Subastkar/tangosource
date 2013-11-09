var mongoose = require('mongoose');

module.exports = mongoose.Schema({
  username: {type: String, required: true},
  roomID: String,
  alive: Boolean,
  waiting: Boolean,
  player: String,
  x: Number,
  y: Number
});
