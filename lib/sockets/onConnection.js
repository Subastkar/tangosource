module.exports = function(socket){
  console.log('Someone just connected');

  socket.on('register player', function(data){
    socket.join(data.room);
    socket.broadcast.to(data.room).emit('new player', data.player);
  });
  

};
