// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('DNTs7CEwCzgqu6bu');

var isProduction = (process.env.NODE_ENV === 'production');
var http = require('http');
var port = (isProduction ? 80 : 8000);

var express = require('express')
  , routes = require('./routes')
  , path = require('path');

var app = express();
var inspect = require('eyes').inspector({stream: null});

global._   = require('underscore');
global.log = function(){
  var args = Array.prototype.slice.call(arguments);
  args[args.length - 1] = inspect(args[args.length - 1]);
  console.log.bind(console).apply(console, args);
};

require('./lib/database')(function(error){
  if(error){ throw new Error(error); }
  log('Database connected');
});
    
// all environments
app.set('port', port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if('development' === app.get('env')){
  app.use(express.errorHandler());
}

require('./routes')(app);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var io = require('socket.io').listen(server);

//Configuration
io.configure(function(){ this.set('log level', 0); });

//Initialize
io.sockets.on('connection', require('./lib/sockets/onConnection'));
