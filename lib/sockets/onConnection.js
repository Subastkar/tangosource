var conf         = require('../../config/game');
var mongoose     = require('mongoose');

var roomSchema   = require('../../models/room');
var Room         = mongoose.model('room', roomSchema);

module.exports = function(socket){
  console.log('Someone just connected');

  socket.on('register player', function(data){

    Room.findOne({_id: data.room}, function(error, daRoom){
      log(error);
      log(daRoom);
      if(daRoom){

        socket.player = data.player;
        socket.room   = data.room;
        socket.join(data.room);

        if(data.player.player !== 'ZombieController'){
          socket.broadcast.to(data.room).emit('new player', data.player);
        }

      }else{
        socket.emit('noabl');
      }
    });

  });

  socket.on('move', function(data){
    socket.broadcast.to(data.room).emit('move', data);
  });

  socket.on('Next level', function(data){

    //TODO improve this // Save level on db
    var level = data.level + 1;
    if(conf['level'+level]){

      Room.findByIdAndUpdate(data.room, {level: level}, function(){
        console.log('Level up');
      });

      socket.emit('new pos', conf['level'+level].position3);
      socket.broadcast.to(data.room).emit('Next Level', data.player); 
    }

  });

  socket.on('create zombies', function(data){
    socket.broadcast.to(data.room).emit('update zombies');
  });

  socket.on('zombies ready', function(data){
    socket.emit('build zombies', data);
    socket.broadcast.to(data.room).emit('build zombies');
  });

  socket.on('move zombie', function(data){
    socket.broadcast.to(data.room).emit('move zombie', data);
  });

  socket.on('shoot', function(data){
    socket.broadcast.to(data.room).emit('someone shotted', data);
  });

  socket.on('zombie injured', function(data){
    socket.broadcast.to(data.room).emit('kill zombie', data);
  });

  socket.on('Kill player', function(data){
    socket.broadcast.to(data.room).emit('Kill player', data.player);
  });

  socket.on('send message', function(data){
    socket.broadcast.to(data.room).emit('send message', data);
  });

  socket.on('disconnect', function(){
    console.log('GOOD BYE');
    console.log(socket.player);
    if(socket.player && socket.player.player === 'ZombieController'){

      Room.remove({_id: socket.room}, function(error, daRoom){
        socket.broadcast.to(socket.room).emit('kill game');
      });

    }
    socket.leave(socket.room);
  });

};
