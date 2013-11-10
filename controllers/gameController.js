var mongoose  = require('mongoose');
var config    = require('../config/game');
var manager   = require('../lib/gameManager');

var userSchema   = require('../models/user');
var roomSchema   = require('../models/room');
var playerSchema = require('../models/player');

var User   = mongoose.model('user', userSchema);
var Room   = mongoose.model('room', roomSchema);
var Player = mongoose.model('player', playerSchema);

var onError = function(err){
  log(err);
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
        data.player = "ZombieController";
      }else{
        _.extend(data, config['level' + room.level].position1);
      }

      User.findOneAndUpdate({_id: newUser.id}, data, function(err, userUpdated){

        //Get player configuration

        Player.findOne({name: userUpdated.player }, function(err, playerConf){
          if(err){ return res.send(400, err); }
          var user;

          if(playerConf){
            user = _.pick(userUpdated, 'id', 'alive', 'player', 'username', 'waiting', 'x', 'y', 'level', 'roomID');
            user.speed = playerConf.speed;
            user.gun = {
              name: playerConf.gun.name,
              speed: playerConf.gun.speed,
              distance: playerConf.gun.distance,
              frequency: playerConf.gun.frequency,
              damage: playerConf.gun.damage
            };

            manager.createZombies(user, function(zombies){
              if(err){ return res.send(400, err);}
              room.players.push(user);
              room.zombies = _.union(room.zombies, zombies);
              room.save(onError);
              res.send({user: user, room: room});
            });
          }else{
            room.players.push(userUpdated);
            room.save(onError);
            res.send({user: userUpdated, room: room});
          }
        });
      });
    });
  },

  getRoom: function(req, res){
    var id = req.query.id;
    var level = req.query.level;

    Room.findOne({_id: id}).exec(function(err, room){

      if(parseInt(room.level, 10) === parseInt(level, 10)){ return res.send(room); }

      manager.createZombies({level: level}, function(zombies){
        room.zombies = zombies;
        room.save();
        res.send(room);
      });

    });
  },

  updateRoom: function(req, res){
    var roomID  = req.body.roomID;
    var zombies = req.body.zombies;

    Room.findOne({_id: roomID}, function(err, room){
      if(err){ return res.send(400, err); }
      if(!room){return res.send(400, 'room not found');}

      //Get new zombies created, just in case...
      var newZombies = _.reject(room.zombies, function(zombie){
        return _.findWhere(zombies, {_id: zombie._id});
      });
      
      var Z = _.compact(_.union(newZombies, zombies));
      if(newZombies){
        zombies = _.union(newZombies, zombies);
      }

      room.zombies = _.compact( _.union(newZombies, zombies));
      room.save(onError);
      res.send('updated zombies n.n');
    });
  },

  killZombie: function(req, res){
    var roomID  = req.body.roomID;
    var zombieID  = req.query.id;

    Room.findOne({_id: roomID}, function(err, room){
      if(err){ return res.send(400, err); }
      if(!room){return res.send(400, 'room not found');}

      var newZombies = _.map(room.zombies, function(zombie){
        if(zombie._id === zombieID) { zombie.life = 0; }
        return _.clone(zombie);
      });

      room.zombies = [];
      room.save(function(error){
        if(error){ return onError(error); }

        room.zombies = newZombies;
        room.save(onError);
      });
      res.send('updated zombies n.n');
    });
  }
};
