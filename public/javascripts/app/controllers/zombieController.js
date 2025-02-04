ZombieWorld.Controller.zombieController = {
  //Joining room
  init: function(){
    var zombies  = JSON.parse(localStorage.getItem('room')).zombies;
    _.each(zombies, function(zombie){
      ZombieWorld.Zombies[zombie._id] = ZombieWorld.Entities.zombie(zombie);
    });
  },

  move: function(opts){
    var Zombie  = ZombieWorld.Zombies[opts.zombieID];

    if(!Zombie){return false;}

    var zombie = Zombie.Entity;
    var destiny = opts.destiny;

    if(zombie && zombie.isPlaying()){ 
      zombie.removeComponent('Tween');
      zombie.stop();
    }

    if(zombie && !zombie.__c.Tween){ zombie.addComponent('Tween'); }

      var animation;
      var difX = zombie.x - destiny.x;
      var difY = zombie.y - destiny.y;
      var velocity;

      if(Math.abs(difX) > Math.abs(difY)){
        animation = zombie.x > destiny.x ? 'walk_left' : 'walk_right' ;
        velocity = (Math.abs(difX) / zombie._speed) * 3;
      }else{
        animation = zombie.y > destiny.y ? 'walk_up' : 'walk_down' ;
        velocity = (Math.abs(difY) / zombie._speed) * 3;
      }
      zombie.animate(animation, 20, -1);

      zombie.tween({x: destiny.x , y: destiny.y}, parseInt(velocity))
      .onHit('Obstacle', function(e){
        zombie.stop();

        if (this._movement) {
          this.x -= this._movement.x;
          this.y -= this._movement.y;
        }

        if(e[0].obj.x > this.x){
          this.x -=1;
        }

        if(e[0].obj.x < this.x){
          this.x +=1;
        }

        if(e[0].obj.y > this.y){
          this.y -=1;
        }

        if(e[0].obj.y < this.y){
          this.y +=1;
        }

        this.removeComponent('Tween');
      }).bind('TweenEnd', function(){
        zombie.stop();
      });
  },

  hit: function(opts){
    var Zombie  = ZombieWorld.Zombies[opts.zombieID];
    Zombie.Entity._life -= opts.damage;

    if(Zombie.Entity._life <= 0){ Zombie.Entity.destroy(); }
  }

};
