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
    'send message'   : 'sendMessage',
    'kill game'      : 'killGame',
    'noabl'          : 'noabl'
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
      ZombieWorld.socket.emit('zombies ready', {room: ZombieWorld.room._id});
  },

  buildZombies: function(){
    ZombieWorld.level = ZombieWorld.level || 1;
    $.ajax({type: 'GET', url: 'room?id='+ZombieWorld.room._id+'&level='+ZombieWorld.level}).done(function(room){
      _.each(room.zombies, function(zombie){
        if(!ZombieWorld.Zombies[zombie._id] && zombie.life > 0){
          var Entity = ZombieWorld.Entities.zombie(zombie);
          Entity._life  = zombie.life;
          Entity._speed = zombie.speed;
          Entity._id = zombie._id;
          Entity.alpha = ZombieWorld.currentPlayer.player === 'ZombieController' ? 0.5 : 1;

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
          } else {
            Entity.bind('Click', function(e){
              ZombieWorld.Controller.playerController.shoot(e);
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

    ZombieWorld.room.players = _.map(JSON.parse(localStorage.getItem('room')).players, function(p){
      if(p.id === player){ p.alive = false; }
      return p;
    });

    localStorage.setItem('room', JSON.stringify(ZombieWorld.room));

    ZombieWorld.Players[player].alive = false;
    ZombieWorld.Players[player].Entity.destroy();
  },

  nextLevel: function(data){
    ZombieWorld.Players[data].waiting = true;
    ZombieWorld.Players[data].Entity.destroy();

    var pending = _.find(ZombieWorld.Players, function(player){
      return !player.waiting && player.player !== 'ZombieController' && player.alive;
    });

    if(!pending && ZombieWorld.currentPlayer.waiting){
      ZombieWorld.Level++;

      ZombieWorld.room.players = _.map(JSON.parse(localStorage.getItem('room')).players, function(p){
        if(p.alive){ p.waiting = false; }
        return p;
      });

      localStorage.setItem('room', JSON.stringify(ZombieWorld.room));

      if(ZombieWorld.Level < 6){
        Crafty.scene('Level'+ZombieWorld.Level);
        ZombieWorld.Controller.playerController.loadPlayers();
        ZombieWorld.socket.emit('create zombies', {room: ZombieWorld.room._id});
      } else {
        Crafty.scene('Victory');
      }
    }

  },

  newPos: function(position){
    console.log('position', position);
    //console.log('current', currentPlayer);
    
    //ZombieWorld.currentPlayer.x = position.x;
    //ZombieWorld.currentPlayer.y = position.y;
    //ZombieWorld.currentPlayer.Entity.x = position.x;
    //ZombieWorld.currentPlayer.Entity.y = position.y;

  },

  sendMessage: function(data){
    $('#chat').append('<p>' + data.player +": "+ data.msg +'</p>');
  },

  killGame: function(){
    ZombieWorld.onError('Zombie Controller left... good bye');
    localStorage.clear();
    window.location.assign('/');
  },

  noabl: function(){
    ZombieWorld.onError('Room not avealable');
    localStorage.clear();
    window.location.assign('/');
  }

};
