$(function () {

  var $body = $('body');
  var $offerListItem = $('.js-offer-list-item');
  var windowHeight = $(window).height();
  var windowWidth = $(window).width();
  var $carousel = $('.js-carousel');
  var $offerListItem_carousel = $('.js-offer-carousel-item');


  $body.addClass('special-offer-page');

  /**
   * default resize options
   */
  function resizeOptions() {
    var height = 0;
    if (windowWidth <= 900 && windowWidth > 767 ){
      height = parseInt(windowHeight / 2);
      $offerListItem.css('height', windowHeight+'px');
    } else if (windowWidth > 900 || windowWidth < 768) {
      height = windowHeight
    }

    $offerListItem.css('height', height+'px');
  }
  resizeOptions();

  /**
   * set default options
   */
  function setDefaultOptions() {
    var lengthLists = $offerListItem.length;

    if (!Number.isInteger(lengthLists/2) && windowWidth > 900){
      $offerListItem_carousel.addClass('vertical');
    }
    if (lengthLists == 2 && windowWidth > 900){
      $offerListItem_carousel.addClass('second');

      $('.b-offer-list-carousel__type').each(function () {
        var $thisLink = $(this).closest('.b-offer-list-carousel__link');
        $('.b-offer-list-carousel__text', $thisLink).append($(this));
      })
    }
  }
  setDefaultOptions();

  /**
   *  carousel init
   */
  $carousel.slick({
    infinite: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    touchThreshold: 20,
    // autoplay: true,
    // autoplaySpeed: 5000,
    adaptiveHeight: true
  });

  $(window).on('resize', function () {
    windowHeight = $(window).height();
    windowWidth = $(window).width();

    resizeOptions();
  });


});