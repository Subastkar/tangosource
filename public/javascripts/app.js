var ZombieWorld = {

  Controller:  {},
  Map: {},
  Grid: [],

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
