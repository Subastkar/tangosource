ZombieWorld.Controller.playerController = {

  init: function(){

    var user = JSON.parse(localStorage.getItem('user'));

    if(!user){ 
      ZombieWorld.onError('First log in'); setTimeout(function(){
        window.location.assign('/login');
      }, 300);
    }else{
      ZombieWorld.currentPlayer = user;
      this.loadPlayers();
    }

  },

  isMyPlayer: function(){

    var player = _.pick(ZombieWorld.currentPlayer, 'id', 'player', 'gun', 'speed');

    ZombieWorld.socket.emit('register player', {
      room: ZombieWorld.room.id,
      player: player
    });

    var Entity = new ZombieWorld.Entities.player(ZombieWorld.currentPlayer);

    Entity.fourway(ZombieWorld.currentPlayer.speed)
    .bind('NewDirection', function(data) {
      this.stop();
      if (data.x > 0) {
        this.animate('walk_right', 20, -1);
      } else if (data.x < 0) {
        this.animate('walk_left',  20, -1);
      } else if (data.y > 0) {
        this.animate('walk_down',  20, -1);
      } else if (data.y < 0) {
        this.animate('walk_up',    20, -1);
      } else {
        this.stop();
      }
    }).bind("EnterFrame", function(e) {
        if(this.isDown("LEFT_ARROW")) {
          this.emit('move', { to: "LEFT_ARROW",  player: player.id, x: this.x, y: this.y});
        } else if(this.isDown("RIGHT_ARROW")) {
          this.emit('move', { to: "RIGHT_ARROW", player: player.id, x: this.x, y: this.y});
        } else if(this.isDown("UP_ARROW")) {
          this.emit('move', { to: "UP_ARROW",    player: player.id, x: this.x, y: this.y});
        } else if(this.isDown("DOWN_ARROW")) {
          this.emit('move', { to: "DOWN_ARROW",  player: player.id, x: this.x, y: this.y});
        }
      });
    
    ZombieWorld.currentPlayer.Entity = Entity;

  },

  loadPlayers: function(){

    ZombieWorld.room = JSON.parse(localStorage.getItem('room'));

    _.each(ZombieWorld.room.players, function(player){

      // This is me !
      if(player === ZombieWorld.currentPlayer.id){
        return this.isMyPlayer();
      }

      //Build Entity
      player.Entity = new ZombieWorld.Entities.player(player);

      //Extend Players
      ZombieWorld.Players[player.id] = player;
      
      
    }, this);

  }

};
