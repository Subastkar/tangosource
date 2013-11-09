ZombieWorld.Controller.socketController = {

  events: { 
    'ping' : 'pong'
  },

  init: function(){
    ZombieWorld.socket = io.connect();
    var self = this;
    _.each(this.events, function(method, key){
      if(typeof self[method] === 'function'){
        ZombieWorld.socket.on(key, _.bind(self[method], self));
      }
    });
  },

  pong: function(){
    console.log('Sockets are set up');
  }

};
