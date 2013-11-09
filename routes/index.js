var htmlController    = require('../controllers/htmlController');
var configController  = require('../controllers/configController');

module.exports = function(app){

  app.get('/', htmlController.index.bind(htmlController));
  app.get('/game', htmlController.game.bind(htmlController));

  //Get configs from the server
  app.get('/configuration', configController.getConfig.bind(configController));

};
