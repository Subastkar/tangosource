var onError = function(error){
  if(error){ console.log(error.message); }
};

var roomSchema = require('../../models/room');

module.exports = function(mongoose, done){

  var Room = mongoose.model('room', roomSchema);

  //Clean collection
  Room.remove({}, onError);

  process.nextTick(done);

};
