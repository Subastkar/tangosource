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

    zombie.tween({speed: 1, x: destiny.x , y: destiny.y}, 250).bind('TweenEnd', function(){
      zombie.stop();
    });
  }

};
