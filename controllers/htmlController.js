module.exports = {

  index: function(req, res){
    res.render('pages/index');
  },

  game: function(req, res){
    res.render('pages/game');
  },

  login: function(req, res){
    res.render('pages/login');
  },

  credits: function(req, res){
    res.render('pages/credits');
  }
};
