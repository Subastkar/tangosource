var utilities = require('../lib/utilities');
var mongoose  = require('mongoose');
var config    = require('../config/game');
var _         = require('underscore');

var roomSchema   = require('../models/room');
var levelSchema  = require('../models/level');
var zombieSchema = require('../models/zombie');

var Room   = mongoose.model('room', roomSchema);
var Level  = mongoose.model('level', levelSchema);
var Zombie = mongoose.model('zombie', zombieSchema);

var onError = function(err){
  log(err);
};

module.exports = {
  createZombies: function(options, cb){

    Level.findOne({level: options.level}, function(err, lvl){
      if(err){return res.send(400, err);}
      var zombies = [];

      for(var i=0; i < lvl.ZombiesPerPlayer; i++){

        //Create  random  zombie
        Zombie.findOne({type: 'zombie' + _.random(1,3)}, function(err, zombie){
          if(err){ return res.send(400, err); }

          var newZombie = _.extend(zombie, {
            _id: utilities.guid(),
          });

          zombies.push(newZombie);
        });
      }

      Room.findOne({_id: options.roomID}, function(err, room){
        room.zombies = _.union(room.zombies, zombies);
        room.players.push(options);
        cb(null, room);
      });

    });
  }
};
