var onError = function(error){
  if(error){ console.log(error.message); }
};

var levelSchema = require('../../models/level');

module.exports = function(mongoose){

  var Level = mongoose.model('level', levelSchema);

  //Clean collection
  Level.remove({}, onError);

  //Level 1
  var Level1 = new Level({
    level: 1,
    ZombiesPerPlayer: 2
  }).save(onError);

};
