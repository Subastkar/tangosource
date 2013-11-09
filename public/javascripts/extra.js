$(function(){
    var path = window.location.pathname;
    var links = $('.navbar-nav li a');
    $.each(links, function(i,val){
        if ($(val).attr('href') === path){
            $(val).parent('li').addClass('active');
        }
    });

  $('#intro-landing .next').on('click',function(){
      $cont = $('#intro-landing');
      scroll = $cont.scrollLeft();
      $cont.animate({scrollLeft: scroll + $cont.outerWidth()}, 500);
  });
  $('#intro-landing .prev').on('click',function(){
      $cont = $('#intro-landing');
      scroll = $cont.scrollLeft();
      $cont.animate({scrollLeft: scroll - $cont.outerWidth()}, 500);
  });
    

});

