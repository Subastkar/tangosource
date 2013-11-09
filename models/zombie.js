var mongoose = require('mongoose');

module.exports = mongoose.Schema({
  name: String,
  type: String,
  speed: Number,
  life: Number,
  x: Number,
  y: Number
});
