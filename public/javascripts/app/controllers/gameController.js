ZombieWorld.Controller.gameController = {

  init: function(){
    ZombieWorld.Controller.socketController.init();
    
    $.getJSON('/configuration?q=map' ,function(data){
      ZombieWorld.Map = data;

      var width = ZombieWorld.Map.width * ZombieWorld.Map.tile.width;
      var height = ZombieWorld.Map.height * ZombieWorld.Map.tile.height;

      Crafty.init(width, height, 'game-area');
      Crafty.background('rgb(56,208,135)');
    });
  }

};
