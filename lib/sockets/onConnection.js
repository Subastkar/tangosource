module.exports = function(socket){
  console.log('Someone just connected');

  socket.emit('ping');

};
