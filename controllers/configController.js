var configurations = require('../config/game');

module.exports = {
  getConfig: function(req, res){
    var query = req.query.q;
    var data  = configurations[query];
    var status = data ? 200 : 400;

    res.send(status, data);
  }
};
