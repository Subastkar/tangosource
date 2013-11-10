var onError = function(error){
  if(error){ console.log(error.message); }
};

var zombieSchema = require('../../models/zombie');

module.exports = function(mongoose, done){
  var Zombie = mongoose.model('zombie', zombieSchema);

  //Clean collection
  Zombie.remove({}, onError);

  var zombie1 = new Zombie({
    name: 'Mechor',
    type: 'zombie1',
    speed: 2,
    life: 10,
    x: 50,
    y: 50
  }).save(onError);

  var zombie2 = new Zombie({
    name: 'Gaspar',
    type: 'zombie2',
    speed: 3,
    life: 15,
    x: 100,
    y: 50
  }).save(onError);

  var zombie3 = new Zombie({
    name: 'Baltazar',
    type: 'zombie3',
    speed: 4,
    life: 20,
    x: 150,
    y: 50
  }).save(onError);

  process.nextTick(done);
};
