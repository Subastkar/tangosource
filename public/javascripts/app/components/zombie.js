ZombieWorld.Components.zombie = Crafty.c('Zombie', {
  init: function(){
    this.addComponent('2D, Collision, Canvas, SpriteAnimation, Tween, Mouse')
    .collision([0,0],[40,0],[40,40],[0,40]);
  }
});
