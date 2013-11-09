var mongoose   = require('mongoose');
var config     = require('../config/game');

var roomSchema   = require('../models/room');
var userSchema   = require('../models/user');
var playerSchema = require('../models/player');

var User   = mongoose.model('user', userSchema);
var Room   = mongoose.model('room', roomSchema);
var Player = mongoose.model('player', playerSchema);

var onError = function(err){
  log(err)
};

module.exports = {
  createUser: function(req, res){
    var user = req.body;

    var newUser = new User(_.extend(user, { alive: true, waiting: false}));
    newUser.save(onError);


    //Search for a room available
    Room.findOne({$where: 'this.players.length < 4'}).exec(function(err, currentRoom){
      if(err){return res.send(400, err);}

      var room = currentRoom || new Room({
        players: [],
        zombies: [],
        level: 1
      });

      //TODO: create zombies!

      var data = { roomID: room._id, level: room.level };

      if(!currentRoom){
        data.player = "ZombieController"
      }else{
        _.extend(data, config['level' + room.level].position1);
      }

      User.findOneAndUpdate({_id: newUser.id}, data, function(err, userUpdated){

        //Get player configuration
        Player.findOne({name: user.type }, function(err, playerConf){
          if(err){ res.send(400, err); }

          if(playerConf){
            var usr = _.pick(userUpdated, 'id', 'alive', 'player', 'username', 'waiting', 'x', 'y', 'level', 'roomID');
            _.extend(usr, _.pick(playerConf, 'speed', 'gun'));
          }

           room.players.push(usr || userUpdated);
           room.save(onError);

           res.send({user: user || userUpdated, room: room});
        });

      });

    });

  }
}
