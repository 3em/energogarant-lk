$(function () {

  var $feedbackForm = $('.js-feedback');
  var $feedbackFormSuccess = $('.js-feedback-success');
  var $feedbackCall = $('.js-feedback-call');
  var $body = $('body');
  var $overlay = $('.js-overlay');
  var $feedbackPopup = $('.js-feedback-popup');

  /**
   * open popup
   */
  $feedbackCall.on('click', function (e) {
    e.preventDefault();

    $overlay.addClass('show');
    $feedbackPopup.addClass('show');
    $body.addClass('overflow');

  });

  /**
   * validate form for amount of filled required felds
   * @param $form - form dom
   */
  function chkform($form) {

    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else {
      $('.b-button', $form).removeAttr('disabled');
    }
  }

  /**
   * set status filled of value more than 0
   */
  $('input, textarea', $feedbackForm).on('keyup paste change input', function () {
    var $this = $(this);

    commonFormsInputsChanging($this, this);

    // check form
    chkform($feedbackForm);
  });

  /**
   * submit form
   */
  $feedbackForm.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);


    submit($this, $this.serialize());
    return false;
  });

  /**
   * submit Form
   * @param $this
   * @param data
   */
  function submit($this, data) {
    var thisFileId = $('.js-file', $this).attr('id');

    $.ajax({
      url: $this.attr('action'),
      processData: false,
      contentType: false,
      method: "POST",
      data: {
        'formFields': data,
        'files': fileArray[thisFileId]
      },
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccess() : showErrorFields($this, data.error)
      },
      error: function () {
        // showError($this);
        showSuccess();
      }
    });
  }

  function showSuccess(){

    $feedbackForm.addClass('hidden');
    $feedbackFormSuccess.removeClass('hidden');

    $feedbackForm[0].reset();
    $('.js-link-stop', $feedbackForm).html('');
    $('.b-dropdown__sub li', $feedbackForm).removeClass('hidden active');
    $('.js-file-insert', $feedbackForm).html('').addClass('hidden');
    $('input, textarea', $feedbackForm).trigger('change');

    $('.js-file', $feedbackForm).each(function () {
      var thisFileId = $(this).attr('id');
      fileArray[thisFileId] = [];
    });
  }

});