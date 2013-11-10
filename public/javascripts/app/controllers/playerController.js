ZombieWorld.Controller.playerController = {

  init: function(){

    var register = localStorage.getItem('register');
    var user     = JSON.parse(localStorage.getItem('user'));

    if(register){ 
      alert('Damn something went wrong!');
      ZombieWorld.socket.emit('kick', user.id);
      localStorage.clear();
      return window.location.assign('/');
    }

    if(!user){ 
      ZombieWorld.onError('First log in'); setTimeout(function(){
        window.location.assign('/login');
      }, 300);
    }else{

      if(user.player === 'ZombieController'){
        user.waiting = true;
        $('#img-trick').remove();
      }

      ZombieWorld.currentPlayer = user;
      this.loadPlayers();
    }

  },

  isMyPlayer: function(){

    var player = _.pick(ZombieWorld.currentPlayer, 'id', 'player', 'gun', 'speed', 'x', 'y', 'alive', 'waiting');

    localStorage.setItem('register', true);

    ZombieWorld.socket.emit('register player', {
      room: ZombieWorld.room._id,
      player: player
    });

    if(player.player === 'ZombieController'){ 
        alert("Welcome, zombie controller. Left click zombies to select, and click on the map for straight line movement. As soon as players join, zombies spawn. If your cursor becomes a zombie, you can place new zombies in areas players can't see.");
      return false; 
    }

    var Entity = new ZombieWorld.Entities.player(ZombieWorld.currentPlayer);

    Entity.fourway(ZombieWorld.currentPlayer.speed)
    .bind('NewDirection', function(data) {
      this.stop();
      if (data.x > 0) {
        this.animate('walk_right', 15, -1);
      } else if (data.x < 0) {
        this.animate('walk_left',  15, -1);
      } else if (data.y > 0) {
        this.animate('walk_down',  15, -1);
      } else if (data.y < 0) {
        this.animate('walk_up',    15, -1);
      } else {
        this.stop();
      }
    }).bind("EnterFrame", function(e) {
        if(this.isDown("LEFT_ARROW")) {
          this.emit('move', { to: "LEFT_ARROW",  player: player.id, x: this.x, y: this.y, room: ZombieWorld.room._id});
        } else if(this.isDown("RIGHT_ARROW")) {
          this.emit('move', { to: "RIGHT_ARROW", player: player.id, x: this.x, y: this.y, room: ZombieWorld.room._id});
        } else if(this.isDown("UP_ARROW")) {
          this.emit('move', { to: "UP_ARROW",    player: player.id, x: this.x, y: this.y, room: ZombieWorld.room._id});
        } else if(this.isDown("DOWN_ARROW")) {
          this.emit('move', { to: "DOWN_ARROW",  player: player.id, x: this.x, y: this.y, room: ZombieWorld.room._id});
        }
    }).bind('Move', function(from){
        if(!ZombieWorld.fog){ return false; }

        var pos = ZombieWorld.fog.offset();

        var x = from._x - 985;
        var y = from._y - 560;

        ZombieWorld.fog.offset({ top: y, left: x});

    }).onHit('Obstacle', function(){
      this.x -= this._movement.x;
      this.y -= this._movement.y;
    }).onHit('Zombie', function(){
      this.destroy();
      ZombieWorld.onError('You are dead');
      localStorage.clear();
      setTimeout(function(){
        window.location.assign('/');
      }, 100);
      this.emit('Kill player', {player: ZombieWorld.currentPlayer.id, room: ZombieWorld.room._id});
    }).onHit('Exit', function(){
      ZombieWorld.currentPlayer.waiting = true;
      this.destroy();
      this.emit('Next level', {player: ZombieWorld.currentPlayer.id, room: ZombieWorld.room._id, level: ZombieWorld.Level});

      var pending = _.find(ZombieWorld.Players, function(player){
        return !player.waiting && player.alive;
      });

      if(!pending){

        ZombieWorld.currentPlayer.waiting = false;

        ZombieWorld.room.players = _.map(JSON.parse(localStorage.getItem('room')).players, function(p){
          if(p.alive){ p.waiting = false; }
          return p;
        });

        localStorage.setItem('room', JSON.stringify(ZombieWorld.room));

        ZombieWorld.Level++;
        if(ZombieWorld.Level < 6){
          Crafty.scene('Level'+ZombieWorld.Level);
          ZombieWorld.Controller.playerController.loadPlayers();
          ZombieWorld.socket.emit('create zombies', {room: ZombieWorld.room._id});
        } else {
          Crafty.scene('Victory');
        }
      }
      
      
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
      
      // This is me !
      if(player.id === ZombieWorld.currentPlayer.id){
        return this.isMyPlayer();
      }

      // This guy does not have an Entity
      if(player.player === "ZombieController" ){ return false; }

      // No need to make Entities for dead players
      if(!player.alive){ return false; }

      //Build Entity
      player.Entity = new ZombieWorld.Entities.player(player);

      //Extend Players
      ZombieWorld.Players[player.id || player._id] = player;
      
      
    }, this);

  },

  shoot: function(e){
    if(ZombieWorld.currentPlayer.shootAbility && !ZombieWorld.currentPlayer.shoot){
      var shooter = Crafty(ZombieWorld.currentPlayer.player);

      ZombieWorld.currentPlayer.shoot = true;
      ZombieWorld.socket.emit('shoot', { 
        gun: ZombieWorld.currentPlayer.gun,
        player: ZombieWorld.currentPlayer.player,
        start: {x: shooter.x, y: shooter.y},
        end: {x: e.realX, y: e.realY}
      });

      setTimeout(function(){
        ZombieWorld.currentPlayer.shoot = false;
      }, ZombieWorld.currentPlayer.gun.frequency * 700);

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
      }).onHit('Zombie', function(e){
        if(e[0].obj.__c.Zombie){
          var zombie = e[0].obj;
          zombie._life -= ZombieWorld.currentPlayer.gun.damage;

          ZombieWorld.socket.emit('zombie injured', { 
            damage: ZombieWorld.currentPlayer.gun.damage,
            zombieID: zombie._id
          });

          if(zombie._life <= 0){ 
            //Update local storage with zombie death
            ZombieWorld.room.rombies = _.map(ZombieWorld.room.zombies, function(z){
              if(z._id === zombie._id){ z.life = 0; }
              return z;
            });
            localStorage.setItem('room', JSON.stringify(ZombieWorld.room));

            //Update database with zombie death
            var data = { roomID: ZombieWorld.room._id,};
            $.ajax({type: 'PUT', url: 'room/kill_zombie?id='+zombie._id, data: data}).done(function(){
              zombie.destroy();
            });
          }
        }
        this.destroy();
      }).bind('TweenEnd', function(){
        this.destroy();
      });
    }
  },

  drawShoot: function(data){
    Crafty.audio.play(data.player+'_shot');
    var attrs = data.start;
    attrs.w = 5;
    attrs.h = 5;
    Crafty.e('Bullet, Collision, Tween').attr(attrs).tween(data.end, 5)
    .onHit('Obstacle', function(){
      this.destroy();
    }).onHit('Zombie', function(){
      this.destroy();
    }).bind('TweenEnd', function(){
      this.destroy();
    });
  }

};
