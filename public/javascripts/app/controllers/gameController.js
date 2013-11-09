ZombieWorld.Controller.gameController = {

  init: function(){
    ZombieWorld.Level = 1; //This should be retrieved by the server
    ZombieWorld.Controller.socketController.init();
    
    var getConfiguration = $.getJSON('/configuration?q=map');
    
    var self = this;
    getConfiguration.done(function(data){
      ZombieWorld.Map = data;

      var width = ZombieWorld.Map.width * ZombieWorld.Map.tile.width;
      var height = ZombieWorld.Map.height * ZombieWorld.Map.tile.height;

      Crafty.init(width, height, 'game-area');
      Crafty.background('rgb(56,208,135)');

      var generateLevel = function(){
        $.getJSON('/configuration?q=level'+ZombieWorld.Level, function(levelConfig){
          ZombieWorld.LevelConfig = levelConfig;
          self.buildGrid(ZombieWorld.LevelConfig.grid);
        });
      };

      Crafty.scene('Level1', generateLevel);
      //Crafty.scene('Level2', generateLevel);
      //Crafty.scene('Level3', generateLevel);

      Crafty.scene('Level'+ZombieWorld.Level);

      //TODO Link player with currentPlayer
      ZombieWorld.Controller.playerController.init();

    });

    getConfiguration.fail(function(){ZombieWorld.onError('There was a problem loading map data.');});
  },

  buildGrid: function(grid){
    _.each(grid, function(x, xIndex){
      _.each(x, function(y, yIndex){
        var attrs = {
          w: ZombieWorld.Map.tile.width,
          h: ZombieWorld.Map.tile.height,
          x: xIndex * ZombieWorld.Map.tile.width,
          y: yIndex * ZombieWorld.Map.tile.height
        };

        switch(grid[xIndex][yIndex]){
          case 0:
            Crafty.e('Free').attr(attrs);
            break;
          case 1:
            Crafty.e('Obstacle').attr(attrs);
            break;
        }
      });
    });
  }
};
