$(function(){
  localStorage.clear();
  $('#loginForm').submit(function(event){
    event.preventDefault();
    var user = {
      username: $('#username').val(),
      player: $('input:radio[name="player"]:checked').val()
    };

    if(user.username && user.player){
      $.ajax({
        method: 'POST',
        url: 'user/create',
        data: user
      }).done(function(res){
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('room', JSON.stringify(res.room));
        window.location.assign('/game');
      });
    }else{
      console.log('Please enter a username and pick a player');
    }
  });
});
