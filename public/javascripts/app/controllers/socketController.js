ZombieWorld.Controller.socketController = {

  events: { 
    'new player'     : 'insertPlayer',
    'move'           : 'move',
    'update zombies' : 'updateZombies',
    'build zombies'  : 'buildZombies',
    'move zombie'    : 'moveZombie'
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
    ZombieWorld.room = JSON.parse(localStorage.getItem('room'));

    //This dude is all ready in
    if(ZombieWorld.Players[player.id]){ return false; }

    //Insert player into local room
    ZombieWorld.room.players.push(player);

    localStorage.setItem('room', JSON.stringify(ZombieWorld.room));

    //Build Entity
    player.Entity = new ZombieWorld.Entities.player(player);

    //Extend Players
    ZombieWorld.Players[player.id] = player;

  },

  move: function(data){

    var Player = ZombieWorld.Players[data.player].Entity;

    if(!Player){ return false; }

    Player.x = data.x;
    Player.y = data.y;

    Player.animate("walk_left", 0 , 1,  3)
    .animate("walk_right", 0 , 2 ,3)
    .animate("walk_up", 0,  3, 3)
    .animate("walk_down", 0, 0 , 3);

    if(data.to === "LEFT_ARROW") {
      if(!Player.isPlaying("walk_left")){
        Player.stop().animate("walk_left", 15, 1);
      }

    } else if(data.to === "RIGHT_ARROW") {
      if(!Player.isPlaying("walk_right")){
        Player.stop().animate("walk_right",15, 1);
      }

    } else if(data.to === "UP_ARROW") {
      if(!Player.isPlaying("walk_up")){
        Player.stop().animate("walk_up",15, 1);
      }

    } else if(data.to === "DOWN_ARROW") {
      if(!Player.isPlaying("walk_down")){
        Player.stop().animate("walk_down",15, 1);
      }
    }

  },

  updateZombies: function(){
      var data = { roomID: ZombieWorld.room._id, zombies: ZombieWorld.zombies};
      $.ajax({type: 'PUT', url: 'room', data: data}).done(function(room){
        ZombieWorld.socket.emit('zombies ready', {room: room._id});
      });
  },

  buildZombies: function(){
    $.ajax({type: 'GET', url: 'room?id='+ZombieWorld.room._id}).done(function(room){
      _.each(room.zombies, function(zombie){
        if(!ZombieWorld.Zombies[zombie._id]){
          var Entity = ZombieWorld.Entities.zombie(zombie);
          var currentZombie;

          if(ZombieWorld.currentPlayer.player === 'ZombieController'){
            Entity.bind('Click', function(){
              currentZombie = _.findWhere(ZombieWorld.Zombies, {Entity: this});
              ZombieWorld.currentZombie = currentZombie;
            });
          }

          ZombieWorld.Zombies[zombie._id] = {Entity: Entity, _id: zombie._id};
        }
      });
    });
  },

  moveZombie: function(data){
    ZombieWorld.Controller.zombieController.move(data);
  }
};
