ZombieWorld.Entities.free = Crafty.c('Free', {
  init: function(){
    this.addComponent('2D, Canvas, Mouse')
    .bind('Click', function(e){
      console.log(e);
    });
  }
});
