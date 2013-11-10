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
    

    $('.player').on('click',function(){
        var av = $(this).data('player')
        $("#avatar-player li img").attr('src','/images/'+av+'.png');
        $('.player').removeClass('selected');
        $(this).addClass('selected');
        $(".player-description li").hide();
        $("."+av).fadeIn("fast");
    });

    $('.chat-icon').on('click',function(){
        $(this).toggleClass('open');
        $('#chat-slide').toggleClass('visible');
    });

});

