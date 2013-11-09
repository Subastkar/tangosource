var ZombieWorld = {

  Controller:  {},
  Map: {},
  LevelConfg: {},

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
