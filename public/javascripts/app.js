var ZombieWorld = {

  Controller:  {},
  Map:         {},
  LevelConfg:  {},
  Entities:    {},
  Components:  {},
  Players:     {},
  Zombies:     {},

  Sprites: {
    player1: Crafty.sprite(40, "/images/player1.png", {
      player1: [0,0]
    }),

    player2: Crafty.sprite(40, "/images/player2.png", {
      player2: [0,0]
    }),

    player3: Crafty.sprite(40, "/images/player3.png", {
      player3: [0,0]
    }),

    zombie1: Crafty.sprite(40, "/images/zombie1.png", {
      zombie1: [0,0]
    }),

    zombie2: Crafty.sprite(40, "/images/zombie2.png", {
      zombie2: [0,0]
    }),

    zombie3: Crafty.sprite(40, "/images/zombie3.png", {
      zombie3: [0,0]
    }),

    bullet: Crafty.sprite(5, "images/bullet.png", {
      bullet: [0,0]
    })

  },

  Sounds: function(){
    Crafty.audio.add({
      player1_shot:       ['/sounds/gun.mp3'],
      player2_shot:       ['/sounds/shotgun.mp3'],
      player2_charge:     ['/sounds/charge.mp3'],
      player3_shot:       ['/sounds/rifle.mp3']
    });
  },

  onError: function(error){
    alert(error);
  }

};

$(function(){
  var game = $('#game').val();

  if(game === 'ready'){
    ZombieWorld.Controller.gameController.init();
  }

  var song = new Audio('/sounds/music/Chaos.mp3');
  ZombieWorld.Music = song;

  song.addEventListener('ended', function(){
    this.currentTime = 0;
    this.play();
  }, false);

  setTimeout(function(){
    song.play();
  },0);

  $('.play').click(function(){
    if(song.paused){
      song.play();
    } else {
      song.pause();
    }
  });
});
