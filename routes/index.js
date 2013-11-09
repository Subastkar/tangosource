var htmlController = require('../controllers/htmlController');

module.exports = function(app){

  app.get('/', htmlController.index.bind(htmlController));
  app.get('/game', htmlController.game.bind(htmlController));

};
