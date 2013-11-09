var onError = function(error){
  if(error){ console.log(error.message); }
};

var userSchema = require('../../models/user');

module.exports = function(mongoose, done){

  var User = mongoose.model('user', userSchema);

  //Clean collection
  User.remove({}, onError);

  process.nextTick(done);

};
