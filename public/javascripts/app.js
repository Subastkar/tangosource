var ZombieWorld = {

};

$(function(){
  var game = $('#game').val();

  if(game === 'ready'){
    ZombieWorld.Controller.gameController.init();
  }

});
