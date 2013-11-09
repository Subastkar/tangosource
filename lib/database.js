var mongoose = require('mongoose');
var db       = mongoose.connection;

mongoose.connect('mongodb://localhost/Zombie');

module.exports = function(cb){
  db.on('error', cb);
  db.once('open', cb);
};
