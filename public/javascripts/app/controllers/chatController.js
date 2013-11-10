$( function(){

  $('#msg').on('keyup', function(event){
    if(event.keyCode === 13){
      $('#chatForm').submit();
    }
  });

  $('#chatForm').submit(function(event){
    event.preventDefault();
    var player = ZombieWorld.currentPlayer;
    var msg =  $('#msg');

    var data = {
      msg: msg.val(),
      player: player.username,
      room: ZombieWorld.room._id
    }

    $('#chat').append('<p> Me: ' + data.msg +'</p>');
    ZombieWorld.socket.emit('send message', data);
    msg.val('');
  });

});

