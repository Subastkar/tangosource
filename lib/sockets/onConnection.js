module.exports = function(socket){
  console.log('Someone just connected');

  socket.on('register player', function(data){
    socket.join(data.room);
    socket.broadcast.to(data.room).emit('new player', data.player);
  });

  socket.on('move', function(data){
    socket.broadcast.to(data.room).emit('move', data);
  });

  socket.on('create zombies', function(data){
    console.log('updatjiiing');
    socket.emit('update zombies', data);
    socket.broadcast.to(data.room).emit('update zombies');
  });

  socket.on('zombies ready', function(data){
    console.log('buildinggg');
    socket.emit('build zombies', data);
    socket.broadcast.to(data.room).emit('build zombies');
  });

};
