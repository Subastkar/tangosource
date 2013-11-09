var mongoose = require('mongoose');
var db       = mongoose.connection;

mongoose.connect('mongodb://localhost/Zombie');

db.on('error', function(error){
  throw new Error(error);
});

db.once('open', function(){

  //Levels
  require('./seeds/levels')(mongoose);

});
