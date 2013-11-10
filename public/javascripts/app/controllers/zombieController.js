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

    if(!zombie.__c.Tween){ zombie.addComponent('Tween'); }

    if(zombie.isPlaying()){ 
      zombie.stop();}

      var animation;
      var difX = zombie.x - destiny.x;
      var difY = zombie.y - destiny.y;

      if(Math.abs(difX) > Math.abs(difY)){
        animation = zombie.x > destiny.x ? 'walk_left' : 'walk_right' ;
      }else{
        animation = zombie.y > destiny.y ? 'walk_up' : 'walk_down' ;
      }
      zombie.animate(animation, 20, -1);

      zombie.tween({speed: 1, x: destiny.x , y: destiny.y}, 250)
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
  }

};
