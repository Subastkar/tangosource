var mongoose = require('mongoose');
var db       = mongoose.connection;
var _        = require('underscore');

mongoose.connect('mongodb://localhost/Zombie');

db.on('error', function(error){
  throw new Error(error);
});

db.once('open', function(){

  var seeds = ['levels', 'players'];

  var ready = _.after(seeds.length, function(){
    process.exit(0);
  });

  //Levels
  require('./seeds/levels')(mongoose, ready);

  //Players
  require('./seeds/players')(mongoose, ready);

});
