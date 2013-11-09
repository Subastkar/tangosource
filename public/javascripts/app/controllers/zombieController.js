ZombieWorld.Controller.zombieController = {
  //Joining room
  init: function(){
    var zombies  = JSON.parse(localStorage.getItem('room')).zombies;
    _.each(zombies, function(zombie){
      ZombieWorld.Zombies[zombie._id] = ZombieWorld.Entities.zombie(zombie);
    });
  }
}
