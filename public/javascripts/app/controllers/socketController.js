ZombieWorld.Controller.socketController = {

  events: { 
    'new player'     : 'insertPlayer',
    'move'           : 'move',
    'update zombies' : 'updateZombies',
    'build zombies'  : 'buildZombies',
    'move zombie'    : 'moveZombie',
    'someone shotted': 'shot',
    'kill zombie'    : 'killZombie',
    'Kill player'    : 'killPlayer',
    'Next Level'     : 'nextLevel',
    'new pos'        : 'newPos',
    'send message'   : 'sendMessage'
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
    ZombieWorld.Players[player.id || player._id] = player;

  },

  move: function(data){

    var Player = ZombieWorld.Players[data.player] ? ZombieWorld.Players[data.player].Entity : null;

    if(!Player){ return false; }

    Player.x = data.x;
    Player.y = data.y;

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
          Entity._life  = zombie.life;
          Entity._speed = zombie.speed;
          Entity._id = zombie._id;

          var currentZombie;

          if(ZombieWorld.currentPlayer.player === 'ZombieController'){
            Entity.bind('Click', function(){

              currentZombie = _.findWhere(ZombieWorld.Zombies, {Entity: this});
              ZombieWorld.currentZombie = currentZombie;

              _.each(ZombieWorld.Zombies, function(zombie){
                zombie.Entity._alpha = 0.5;
              });

              this.alpha = 1;
            });
          }
          ZombieWorld.Zombies[zombie._id] = {Entity: Entity, _id: zombie._id};
        }
      });
    });
  },

  moveZombie: function(data){
    ZombieWorld.Controller.zombieController.move(data);
  },

  shot: function(data){
    ZombieWorld.Controller.playerController.drawShoot(data);
  },

  killZombie: function(data){
    ZombieWorld.Controller.zombieController.hit(data);
  },

  killPlayer: function(player){
    ZombieWorld.Players[player].alive = false;
    ZombieWorld.Players[player].Entity.destroy();
  },

  nextLevel: function(data){
    ZombieWorld.Players[data].waiting = true;
    ZombieWorld.Players[data].Entity.destroy();

    var pending = _.find(ZombieWorld.Players, function(player){
      return !player.waiting && player.player !== 'ZombieController'; // && !player.alive
    });

    if(!pending && ZombieWorld.currentPlayer.waiting){
      ZombieWorld.Level++;
      Crafty.scene('Level'+ZombieWorld.Level);
      ZombieWorld.Controller.playerController.loadPlayers();
    }

  },

  newPos: function(position){
    ZombieWorld.currentPlayer.x = position.x;
    ZombieWorld.currentPlayer.y = position.y;
    ZombieWorld.currentPlayer.Entity.x = position.x;
    ZombieWorld.currentPlayer.Entity.y = position.y;

  },

  sendMessage: function(data){
    $('#chat').append('<p>' + data.player +": "+ data.msg +'</p>');
  }

};
