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

    //Search for a room available
    Room.findOne({$where: 'this.players.length < 4'}).exec(function(err, currentRoom){
      if(err){return res.send(400, err);}

      var room = currentRoom || new Room({
        players: [],
        zombies: [],
        level: 1
      });

      var newUser = new User(_.extend(user, { alive: true, waiting: false}));
      newUser.save(onError);

      room.players.push(newUser._id);
      room.save(onError);

      var data = { roomID: room._id, level: room.level};


      if(!currentRoom){
        data.player = 'ZombieController';
      }else{
        _.extend(data, config['level' + room.level].position1);
        //TODO: create zombies!
      }

      User.findOneAndUpdate({_id: newUser.id}, data, function(err, userUpdated){

        if(!currentRoom){

          //Get player configuration
          Player.findOne({name: user.type }, function(err, playerConf){
            if(err){ res.send(400, err); }

            user = _.pick(userUpdated, 'id', 'alive', 'player', 'username', 'waiting', 'x', 'y', 'level', 'roomID');
            _.extend(user, _.pick(playerConf, 'speed', 'gun'));
          });

          res.send({user: user, room: room});
        }else{
          res.send({user: userUpdated, room: room});
        }

      });

    });

  }
}
