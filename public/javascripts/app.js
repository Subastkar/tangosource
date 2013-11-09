var ZombieWorld = {

  Controller:  {},
  Map:         {},
  LevelConfg:  {},
  Entities:    {},
  Components:  {},
  Players:     {},

  Sprites: {

    player1: Crafty.sprite(40, "/images/player1.png", {
      Player1: [0,0]
    }),

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
