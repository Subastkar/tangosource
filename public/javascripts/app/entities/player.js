ZombieWorld.Entities.player = function(player){

  return Crafty.e('Player, ' + player.player )
      .attr({
        x: player.x,
        y: player.y
      })
      .requires('Keyboard')
      .animate("walk_left",  0, 1, 3)
      .animate("walk_right", 0, 2, 3)
      .animate("walk_up",    0, 3, 3)
      .animate("walk_down",  0, 0, 3)
      .bind('Move', function(from){

        var pos = ZombieWorld.fog.offset();

        var x = from._x - 950;
        var y = from._y - 350;

        ZombieWorld.fog.offset({ top: y, left: x});

      });

};
