var onError = function(error){
  if(error){ console.log(error.message); }
};

var playerSchema = require('../../models/player');

module.exports = function(mongoose){
  var Player = mongoose.model('player', playerSchema);

  //Clean collection
  Player.remove({}, onError);

  var player1 = new Player({
    type: 'Player1',
    gun: {
      name: 'pistol',
      damage: 1,
      speed:  3,
      frequency: 1,
      distance: 300
    },
    speed: 3
  }).save(onError);

  var player2 = new Player({
    type: 'Player2',
    gun: {
      name: 'shotgun',
      damage: 5,
      speed:  2,
      frequency: 2,
      distance: 200
    },
    speed: 2
  }).save(onError);

  var player3 = new Player({
    type: 'Player3',
    gun: {
      name: 'rifle',
      damage: 10,
      speed:  3,
      frequency: 5,
      distance: 1000
    },
    speed: 1
  }).save(onError);

};
