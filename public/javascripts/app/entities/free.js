ZombieWorld.Entities.free = Crafty.c('Free', {
  init: function(){
    this.addComponent('2D, Canvas, Mouse')
    .bind('Click', function(e){
      if(ZombieWorld.currentPlayer.player !== 'ZombieController'){
        ZombieWorld.Controller.playerController.shoot(e);
      }else if(ZombieWorld.currentZombie){

        var zombie = ZombieWorld.currentZombie.Entity;

        if(zombie.isPlaying()){ zombie.stop();}

        var  destiny = {
          x: this.x,
          y: this.y
        }

        var animation;
        var difX = zombie.x - destiny.x;
        var difY = zombie.y - destiny.y;

        if(Math.abs(difX) > Math.abs(difY)){
          animation = zombie.x > destiny.x ? 'walk_left' : 'walk_right' ;
        }else{
          animation = zombie.y > destiny.y ? 'walk_up' : 'walk_down' ;
        }

        zombie.animate(animation, 20, -1);

        zombie.tween({speed: 1, x: destiny['x'] , y: destiny['y']}, 250);
      }
    });
  }
});
