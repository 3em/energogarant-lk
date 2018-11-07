$(function () {

  var $body = $('body');
  var $enterForm = $('.js-enter-form');
  var $registrationForm = $('.js-registration-form');
  var $authorizationTabs = $('.js-authorization-tabs');
  var $smsForm = $('.js-registration-prove-form');
  var $passProveBox = $('.js-pass-prove');
  var $sendSmsLink = $('.js-send-sms');
  var $smsTime = $('.js-send-sms-time');
  var $sendSmsText = $('.js-send-sms-text');



  /**
   * resend sms
   */
  $sendSmsLink.on('click', function (e) {
    e.preventDefault();

    var thisUrl = $(this).attr('data-action');

    $.ajax({
      url: thisUrl,
      method: "POST",
      data: '',
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSmsTimer() : showError($smsForm)
      },
      error: function () {
        showError($smsForm);
      }
    });
  });

  /**
   * show sms resend pass timer
   */
  function showSmsTimer() {
    $smsForm[0].reset();

    $sendSmsText.toggleClass('hidden');
    $sendSmsLink.toggleClass('hidden');

    var timing = 30;
    $smsTime.html(timing +' '+ declension(timing, 'секунду', 'секунды', 'секунд'));

    var interval = setInterval(function () {
      timing--;
      $smsTime.html(timing +' '+ declension(timing, 'секунду', 'секунды', 'секунд'));
    }, 1000);
    setTimeout(function () {
      clearInterval(interval);
      $sendSmsText.toggleClass('hidden');
      $sendSmsLink.toggleClass('hidden');
    }, 30000);
  }

  /**
   * set default options
   */
  function setDeafault() {
    $body.addClass('b-authorization-page');
    $('input, textarea', $enterForm).trigger('change');
  }
  setDeafault();

  // VALIDATION

  /**
   * validate form for amount of filled required felds
   * @param $form - form dom
   */
  function chkformEnter($form) {

    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if ($('.js-phone-input', $form).val().length < 17) {
      $('.b-button', $form).attr('disabled', 'disabled');
    }
    // else if (!$('.js-agree', $form).is(':checked')){
    //   $('.b-button', $form).attr('disabled', 'disabled');
    // }
    else {
      $('.b-button', $form).removeAttr('disabled');
    }
  }

  /**
   * validate form for amount of filled required felds
   * @param $form - form dom
   */
  function chkformSms($form) {

    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else {
      $('.b-button', $form).removeAttr('disabled');
    }
  }

  /**
   * validate form for amount of filled required felds
   * @param $form - form dom
   */
  function chkformRegistration($form) {
    var emailMask = /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-zA-Z0-9]{1}[a-zA-Z0-9\-]{0,62}[a-zA-Z0-9]{1})|[a-zA-Z])\.)+[a-zA-Z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/;
    var validEmail = emailMask.test($('.js-email-input', $form).val());


    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if ($('.js-phone-input', $form).val().length < 17) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if (!validEmail){
      $('.b-button', $form).attr('disabled', 'disabled');
    }
    // else if (!$('.js-agree', $form).is(':checked')){
    //   $('.b-button', $form).attr('disabled', 'disabled');
    // }
    else {
      $('.b-button', $form).removeAttr('disabled');
    }
  }

  /**
   * set status filled of value more than 0
   */
  $('input, textarea', $enterForm).on('keyup paste change input', function () {
    var $this = $(this);

    commonFormsInputsChanging($this, this);

    // check form
    chkformEnter($enterForm);
  });

  /**
   * set status filled of value more than 0
   */
  $('input, textarea', $smsForm).on('keyup paste change input', function () {
    var $this = $(this);

    commonFormsInputsChanging($this, this);

    // check form
    chkformSms($smsForm);
  });

  /**
   * set status filled of value more than 0
   */
  $('input, textarea', $registrationForm).on('keyup paste change input', function () {
    var $this = $(this);

    commonFormsInputsChanging($this, this);

    // check form
    chkformRegistration($registrationForm);
  });

  /**
   * submit form
   */
  $enterForm.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);

    submitEnter($this, $this.serialize());
    return false;
  });

  $registrationForm.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);

    submitRegistration($this, $this.serialize());
    return false;
  });

  $smsForm.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);

    submitSms($this, $this.serialize());
    return false;
  });

  /**
   * submit Enter Form
   * @param $this
   * @param data
   */
  function submitEnter($this, data) {
    $.ajax({
      url: $this.attr('action'),
      method: "POST",
      data: data,
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessEnter(data.success) : showErrorFields($this, data.error)
      },
      error: function () {
        showError($this);
      }
    });
  }

  /**
   * submit Registration Form
   * @param $this
   * @param data
   */
  function submitRegistration($this, data) {
    $.ajax({
      url: $this.attr('action'),
      method: "POST",
      data: data,
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessRegistration() : showErrorFields($this, data.error)
      },
      error: function () {
        // showError($this);
        showSuccessRegistration();
      }
    });
  }

  /**
   * submit Registration Form
   * @param $this
   * @param data
   */
  function submitSms($this, data) {
    $.ajax({
      url: $this.attr('action'),
      method: "POST",
      data: data,
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessEnter(data.success) : showErrorFields($this, data.error)
      },
      error: function () {
        showError($this);
      }
    });
  }

  /**
   * enter success load new page
   * @param url - присылать урл по которому идет редерект после логина
   */
  function showSuccessEnter(url) {
    window.location.assign(url);
  }

  /**
   * show step registration with sms pass
   */
  function showSuccessRegistration() {
    $authorizationTabs.addClass('hidden');
    $passProveBox.removeClass('hidden');
  }

});