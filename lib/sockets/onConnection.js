var conf = require('../../config/game');

module.exports = function(socket){
  console.log('Someone just connected');

  socket.on('register player', function(data){
    socket.join(data.room);

    if(data.player.player !== 'ZombieController'){
      socket.broadcast.to(data.room).emit('new player', data.player);
    }
  });

  socket.on('move', function(data){
    socket.broadcast.to(data.room).emit('move', data);
  });

  socket.on('Next level', function(data){

    //TODO improve this // Save level on db
    var level = data.level + 1;
    if(conf['level'+level]){
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

};
