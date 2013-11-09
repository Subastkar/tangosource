var mongoose = require('mongoose');
var db       = mongoose.connection;
var conf     = require('../config/database');

mongoose.connect('mongodb://' + conf.user + ':' + conf.pass + '@' + conf.host + ':' + conf.port + '/' + conf.name);

module.exports = function(cb){
  db.on('error', cb);
  db.once('open', cb);
};
