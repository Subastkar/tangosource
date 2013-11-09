var mongoose   = require('mongoose');

var userSchema = require('../models/user');
var User     = mongoose.model('user', userSchema);

var onError = function(err){
  log(err)
};

module.exports = {
  createUser: function(req, res){
    var user = req.body;
    
    var newUser = new User(user);
    newUser.save(onError);
    res.send(newUser);
  }
}

