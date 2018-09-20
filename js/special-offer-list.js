$(function () {

  var $body = $('body');
  var $offerListItem = $('.js-offer-list-item');
  var windowHeight = $(window).height();
  var windowWidth = $(window).width();
  var $carousel = $('.js-carousel');
  var $offerListItem_carousel = $('.js-offer-carousel-item');

  var $offerListItemSort = $('.js-list-item-sort');
  var $filterCall = $('.js-filter-call');
  var $filterLink = $('.js-filter-link');
  var $filterBox = $('.js-filter-box');


  $body.addClass('special-offer-page');

  /**
   * filter offer items
   */
  $filterLink.on('click', function (e) {
    e.preventDefault();

    $filterBox.removeClass('open');

    if (!$(this).hasClass('active')){
      var thisHref = $(this).attr('href').replace('#','');
      $filterLink.removeClass('active');
      $(this).addClass('active');
      $offerListItemSort.addClass('hidden');
      $('.js-list-item-sort[data-status='+thisHref+']').removeClass('hidden');
    } else {
      $filterLink.removeClass('active');
      $offerListItemSort.removeClass('hidden');
    }

    setDefaultOptions();
    $carousel.slick('reinit');
  });

  /**
   * open filter
   */
  $filterCall.on('click', function (e) {
    e.preventDefault();
    $filterBox.toggleClass('open');
  });

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

    var lengthLists = 0;
    $offerListItem.each(function () {
      if (!$(this).hasClass('hidden')){
        lengthLists = lengthLists + 1;
      }
    });

    if (lengthLists == 2){
      $offerListItem.addClass('single');
    } else{
      $offerListItem.removeClass('single');
    }


    if (!Number.isInteger(lengthLists/2) && windowWidth > 900){
      $offerListItem_carousel.addClass('vertical');
    } else if (Number.isInteger(lengthLists/2)) {
      $offerListItem_carousel.removeClass('vertical');
    }

    if (lengthLists == 2 && windowWidth > 900){
      $offerListItem_carousel.addClass('second');
    } else if (lengthLists != 2 && windowWidth > 900) {
      $offerListItem_carousel.removeClass('second');
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