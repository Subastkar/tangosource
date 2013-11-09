var mongoose = require('mongoose');

module.exports = mongoose.Schema({

  players: Array,
  zombies: Array,
  level:   { type: Number, required: true }

});
