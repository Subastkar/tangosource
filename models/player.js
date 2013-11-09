var mongoose = require('mongoose');

module.exports = mongoose.Schema({

  name: String,
  speed: Number,
  gun:{ 
    name: String,
    damage: Number,
    speed: Number,
    frequency: Number,
    distance: Number
  }

});
