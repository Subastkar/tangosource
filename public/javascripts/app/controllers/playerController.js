ZombieWorld.Controller.playerController = {

  init: function(){

    // Get data from real player
    var player = {
      type: 'player1',
      x: 50,
      y: 50,
      speed: 1
    };

    var Entity = ZombieWorld.Entities.player(player);

    Entity.fourway(player.speed)
    .bind('NewDirection', function(data) {
      this.stop();
      if (data.x > 0) {
        this.animate('walk_right', 20, -1);
      } else if (data.x < 0) {
        this.animate('walk_left',  20, -1);
      } else if (data.y > 0) {
        this.animate('walk_down',  20, -1);
      } else if (data.y < 0) {
        this.animate('walk_up',    20, -1);
      } else {
        this.stop();
      }
    });

  }

};
