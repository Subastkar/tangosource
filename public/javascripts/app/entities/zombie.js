ZombieWorld.Entities.zombie = function(zombie){

  return Crafty.e('Zombie, ' + 'zombie1')
      .attr({
        x: zombie.x,
        y: zombie.y,
        alpha: 1
      })
      .animate("walk_left",  0, 1, 3)
      .animate("walk_right", 0, 2, 3)
      .animate("walk_up",    0, 3, 3)
      .animate("walk_down",  0, 0, 3);
};
