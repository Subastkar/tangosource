ZombieWorld.Entities.free = Crafty.c('Free', {
  init: function(){
    this.addComponent('2D, Canvas, Mouse')
    .bind('Click', function(e){
      if(ZombieWorld.currentPlayer.player !== 'ZombieController'){
        ZombieWorld.Controller.playerController.shoot(e);
      }else if(ZombieWorld.currentZombie){

        var opts = {
          destiny: {
            x: e.realX,
            y: e.realY,
          },
          zombieID: ZombieWorld.currentZombie._id,
          room: ZombieWorld.room._id
        };

        ZombieWorld.Controller.zombieController.move(opts);
        ZombieWorld.socket.emit('move zombie', opts);
      }
    });
  }
});
