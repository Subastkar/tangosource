ZombieWorld.Entities.player = function(player){

  return Crafty.e('Player, ' + player.player )
      .attr({
        x: player.x,
        y: player.y
      })
      .requires('Keyboard')
      .animate("walk_left",  4, 1, 5)
      .animate("walk_right", 4, 2, 5)
      .animate("walk_up",    4, 3, 5)
      .animate("walk_down",  4, 0, 5);
};
