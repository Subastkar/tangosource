ZombieWorld.Controller.socketController = {

  events: { 
    'new player' : 'insertPlayer'
  },

  init: function(){
    ZombieWorld.socket = io.connect();
    var self = this;
    _.each(this.events, function(method, key){
      if(typeof self[method] === 'function'){
        ZombieWorld.socket.on(key, _.bind(self[method], self));
      }
    });
  },

  insertPlayer: function(player){

    //This dude is all ready in
    if(ZombieWorld.Players[player.id]){ return false; }

    //Insert player into local room
    ZombieWorld.room.players[player.id] = player;
    localStorage.setItem('room', JSON.stringify(ZombieWorld.room));

    player.Entity = new ZombieWorld.Entities.player(player);

    ZombieWorld.Players[player.id] = player;

  }

};
