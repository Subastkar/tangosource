ZombieWorld.Controller.playerController = {

  init: function(){

    var user          = JSON.parse(localStorage.getItem('user'));

    ZombieWorld.currentPlayer = user;

    var Entity = ZombieWorld.Entities.player(user);

    Entity.fourway(user.speed)
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

    ZombieWorld.currentPlayer.player.Entity = Entity;
  }
};
