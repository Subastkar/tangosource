var onError = function(error){
  if(error){ console.log(error.message); }
};

var playerSchema = require('../../models/player');

module.exports = function(mongoose, done){
  var Player = mongoose.model('player', playerSchema);

  //Clean collection
  Player.remove({}, onError);

  var player1 = new Player({
    name: 'player1',
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
    name: 'player2',
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
    name: 'player3',
    gun: {
      name: 'rifle',
      damage: 10,
      speed:  3,
      frequency: 3,
      distance: 1000
    },
    speed: 1
  }).save(onError);

  process.nextTick(done);

};
