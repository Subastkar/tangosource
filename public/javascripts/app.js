var ZombieWorld = {

  Controller:  {},
  Map:         {},
  LevelConfg:  {},
  Entities:    {},
  Components:  {},
  Players:     {},

  Sprites: {
    player1: Crafty.sprite(40, "/images/player1.png", {
      player1: [0,0]
    }),

    player2: Crafty.sprite(40, "/images/player1.png", {
      player2: [0,0]
    }),

    player3: Crafty.sprite(40, "/images/player1.png", {
      player3: [0,0]
    })
  },

  onError: function(error){
    alert(error);
  }

};

$(function(){
  var game = $('#game').val();

  if(game === 'ready'){
    ZombieWorld.Controller.gameController.init();
  }

});
