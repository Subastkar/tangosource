ZombieWorld.Controller.playerController = {

  init: function(){

    var user = JSON.parse(localStorage.getItem('user'));

    if(user.player === 'ZombieController'){
      $('#img-trick').remove();
    }

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

    var player = _.pick(ZombieWorld.currentPlayer, 'id', 'player', 'gun', 'speed', 'x', 'y');

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
    }).onHit('Obstacle', function(){
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    });
      
    
    ZombieWorld.currentPlayer.Entity = Entity;

    var diff;
    $( "#game-area" ).mousemove(function( event ) {
      var pos = $( "#game-area" ).offset();

      var y = event.pageY - pos.top - 20;
      var x = event.pageX - pos.left - 20;

      ZombieWorld.currentPlayer.shootAbility = true;
      $('#game-area').css("cursor", "url(/images/aim.cur), auto");
      if(x > Entity.x){
        diff = x - Entity.x;
        if(diff > ZombieWorld.currentPlayer.gun.distance){
          ZombieWorld.currentPlayer.shootAbility = false;
          $('#game-area').css("cursor", "default");
        }
      }

      if(x < Entity.x){
        diff = Entity.x - x;
        if(diff > ZombieWorld.currentPlayer.gun.distance){
          ZombieWorld.currentPlayer.shootAbility = false;
          $('#game-area').css("cursor", "default");
        }
      }

      if(y > Entity.y){
        diff = y - Entity.y;
        if(diff > ZombieWorld.currentPlayer.gun.distance){
          ZombieWorld.currentPlayer.shootAbility = false;
          $('#game-area').css("cursor", "default");
        }
      }

      if(y < Entity.y){
        diff = Entity.y - y;
        if(diff > ZombieWorld.currentPlayer.gun.distance){
          ZombieWorld.currentPlayer.shootAbility = false;
          $('#game-area').css("cursor", "default");
        }
      }

    });

    ZombieWorld.fog = $('#img-trick');

    var pos = ZombieWorld.fog.offset();

    var x = Entity._x - 985;
    var y = Entity._y - 560;

    ZombieWorld.fog.offset({ top: y, left: x});
    

  },

  loadPlayers: function(){

    ZombieWorld.room = JSON.parse(localStorage.getItem('room'));

    _.each(ZombieWorld.room.players, function(player){
      
      // This guy does not have an Entity
      if(player.player === "ZombieController" ){ return false; }

      // This is me !
      if(player.id === ZombieWorld.currentPlayer.id){
        return this.isMyPlayer();
      }

      //Build Entity
      player.Entity = new ZombieWorld.Entities.player(player);

      //Extend Players
      ZombieWorld.Players[player.id] = player;
      
      
    }, this);

  },

  shoot: function(e){
    if(ZombieWorld.currentPlayer.shootAbility){
      var shooter = Crafty(ZombieWorld.currentPlayer.player);

      Crafty.audio.play(ZombieWorld.currentPlayer.player+'_shot');
      Crafty.e('Bullet, Collision, Tween').attr({
        x: shooter.x,
        y: shooter.y,
        w: 5,
        h: 5
      }).tween({
        x: e.realX,
        y: e.realY
      }, 5)
      .onHit('Obstacle', function(){
        this.destroy();
      })
      .onHit('Zombie', function(){
        debugger;
      })
      .bind('TweenEnd', function(){
        this.destroy();
      });
    }
    //TODO this logic wen click on a Zombie

    // var Player = ZombieWorld.currentPlayer.Entity;
    // var distance;

    // if(Player.x > e.x){
    //   distance = Player.x - e.x;
    //   console.log(distance);
    //   if(distance < ZombieWorld.currentPlayer.gun.distance){
    //     console.log('hit');
    //   }
    // }

    // console.log('Player: ', Player.x, Player.y);
    // console.log('Hit: ', e.x, e.y);

  }

};
