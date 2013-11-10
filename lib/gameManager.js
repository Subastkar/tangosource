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

    var i;
    var zombies = [];

    Level.findOne({level: options.level}, function(error, level){

      var sendZombies = _.after(level.ZombiesPerPlayer, function(){
        log('Zombies: ', zombies);
        return cb(zombies);
      });

      for(i=0; i < level.ZombiesPerPlayer; i++){

        //Create  random  zombie
        Zombie.findOne({type: 'zombie' + _.random(1,3)}, function(err, zombie){
          if(err){ return res.send(400, err); }

          zombie.id = utilities.guid();
          zombies.push(_.pick(zombie, "name", "type", "speed", "life", "x", "y"));
          sendZombies();

        });

      }

    });

  }
};
