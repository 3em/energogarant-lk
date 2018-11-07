$(function () {

  var $body = $('body');
  var windowHeight = $(window).height();
  var windowWidth = $(window).width();
  var $blocksWindowHeight = $('.js-window-height');
  var $blocksWindowHeightHalf = $('.js-window-height-half');
  var $offerNavItem = $('.js-offer-nav-item');
  var $popupCurator = $('.js-popup-curator');
  var $curatorForm = $('.js-curator-form');
  var $curatorSuccess = $('.js-curator-success');
  var $curatorPopupCall = $('.js-curator-call');
  var $overlay = $('.js-overlay');


  $body.addClass('offer-page');

  /**
   * open popup curator
   */
  $curatorPopupCall.on('click', function (e) {
    e.preventDefault();
    $overlay.addClass('show');
    $popupCurator.addClass('show');
    $body.addClass('overflow');
  });

  // VALIDATION

  /**
   * validate form for amount of filled required felds
   * @param $form - form dom
   */
  function chkformCurator($form) {

    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if ($('.js-phone-input', $form).val().length < 17) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else {
      $('.b-button', $form).removeAttr('disabled');
    }
  }

  /**
   * set status filled of value more than 0
   */
  $('input, textarea', $curatorForm).on('keyup paste change input', function () {
    var $this = $(this);

    commonFormsInputsChanging($this, this);

    // check form
    chkformCurator($curatorForm);
  });

  /**
   * submit form
   */
  $curatorForm.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);

    submit($this, $this.serialize());
    return false;
  });

  /**
   * submit Enter Form
   * @param $this
   * @param data
   */
  function submit($this, data) {
    $.ajax({
      url: $this.attr('action'),
      method: "POST",
      data: data,
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessCurator() : showErrorFields($this, data.error)
      },
      error: function () {
        showSuccessCurator();
        // showError($this);
      }
    });
  }

  /**
   * show success Curator form
   */
  function showSuccessCurator() {
    $curatorForm[0].reset();
    $curatorForm.addClass('hidden');
    $curatorSuccess.removeClass('hidden');
  }

  /**
   * def oprions
   */
  function setDefaultValues() {
    var halfHeight = parseInt(windowHeight / 2);
    $blocksWindowHeight.css('height', windowHeight+'px');
    $blocksWindowHeightHalf.css('height', halfHeight+'px');
  }
  setDefaultValues();

  /**
   * set nav items height
   */
  function setNavHeightItems() {
    var length = $offerNavItem.length;
    var height = 100 / length;
    $offerNavItem.css('height', height+'%');
  }
  setNavHeightItems();


  $(window).on('resize', function () {
    windowHeight = $(window).height();
    windowWidth = $(window).width();

    setDefaultValues();
  });

});