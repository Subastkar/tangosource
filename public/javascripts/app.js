var ZombieWorld = {

  Controller:  {},
  Map: {}

};

$(function(){
  var game = $('#game').val();

  if(game === 'ready'){
    ZombieWorld.Controller.gameController.init();
  }

});
