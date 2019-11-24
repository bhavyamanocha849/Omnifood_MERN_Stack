$(document).ready(function() {
  $(document).scroll(function() {
    var pos = $(document).scrollTop();
    var pos1 = ($("#one").offset().top + $("#two").offset().top) / 3;
    // if (pos > $(".nav").offset().top) {
    //   $("nav").addClass("jqnav");
    // }
    if(window.scrollY>0){
      $("nav").addClass("jqnav");
    }
     else {
      $("nav").removeClass("jqnav");
    }
    if (pos >= pos1) {
      $("#two").addClass("animated fadeIn delay-0.75s");
    }
    if(pos>=$("#article p").offset().top-100){
      $(".steps-img").addClass("animated slideInUp delay-0.75s");
    }
  });
});
