var mongoose   = require('mongoose');

var roomSchema = require('../models/room');
var userSchema = require('../models/user');

var User     = mongoose.model('user', userSchema);
var Room     = mongoose.model('room', roomSchema);

var onError = function(err){
  log(err)
};

module.exports = {
  createUser: function(req, res){
    var user = req.body;
    
    var newUser = new User(user);
    newUser.save(onError);

    //Search for a room available
    Room.findOne({$where: 'this.players.length < 4'}).exec(function(err, currentRoom){
      if(err){return res.send(400, err);}

      var room = currentRoom || new Room({
        players: [],
        zombies: [],
        level: 1
      });


      log(newUser);
      room.players.push(newUser._id);
      room.save(onError);
      res.send({user: newUser, room: room});
    });

  }
}
