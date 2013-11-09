ZombieWorld.Controller.gameController = {

  init: function(){
    ZombieWorld.Controller.socketController.init();
    
    //This should be changed with the specifics of the maps once the config is done
    Crafty.init(1040,540, 'game-area')
    Crafty.background('rgb(56,208,135)');
  }

};
