var htmlController    = require('../controllers/htmlController');
var configController  = require('../controllers/configController');
var gameController    = require('../controllers/gameController');

module.exports = function(app){

  app.get('/', htmlController.index.bind(htmlController));
  app.get('/login', htmlController.login.bind(htmlController));
  app.get('/game', htmlController.game.bind(htmlController));

  //Get configs from the server
  app.get('/configuration', configController.getConfig.bind(configController));

  //Create an user
  app.post('/user/create', gameController.createUser.bind(gameController));

  //Get room
  app.get('/room', gameController.getRoom.bind(gameController));

  //Update room
  app.put('/room', gameController.updateRoom.bind(gameController));

};
