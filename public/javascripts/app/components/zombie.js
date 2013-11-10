ZombieWorld.Components.zombie = Crafty.c('Zombie', {
  init: function(){
    this._life = 0;
    this._speed = 0;
    this.addComponent('2D, Collision, Canvas, SpriteAnimation, Tween, Mouse')
    .collision([0,0],[40,0],[40,40],[0,40]);
  }
});
