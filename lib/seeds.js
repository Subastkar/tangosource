var mongoose = require('mongoose');
var db       = mongoose.connection;
var _        = require('underscore');
var conf     = require('../config/database');

// mongoose.connect('mongodb://localhost/Zombie');
mongoose.connect('mongodb://' + conf.user + ':' + conf.pass + '@' + conf.host + ':' + conf.port + '/' + conf.name);

db.on('error', function(error){
  throw new Error(error);
});

db.once('open', function(){

  var seeds = ['levels', 'players', 'rooms', 'users', 'zombies'];

  var ready = _.after(seeds.length, function(){
    process.exit(0);
  });

  //Levels
  require('./seeds/levels')(mongoose, ready);

  //Players
  require('./seeds/players')(mongoose, ready);

  //Rooms
  require('./seeds/rooms')(mongoose, ready);

  //Users
  require('./seeds/users')(mongoose, ready);
  
  //Zombies
  require('./seeds/zombies')(mongoose, ready);

});
