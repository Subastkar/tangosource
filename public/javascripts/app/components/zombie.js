ZombieWorld.Components.zombie = Crafty.c('Zombie', {
  init: function(){
    this._life = 0;
    this._speed = 0;
    this.addComponent('2D, Collision, Canvas, SpriteAnimation, Tween, Mouse')
    .collision([0,-20],[30,-20],[30,30],[0,30]);
  }
});
