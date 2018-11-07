$(function () {

  var $body = $('body');
  var $form1 = $('.js-pass-recover-1');
  var $form2 = $('.js-pass-recover-2');
  var $form3 = $('.js-pass-recover-3');
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
        data.result === 'ok' ? showSmsTimer() : showError($form2)
      },
      error: function () {
        showError($form2);
      }
    });
  });

  /**
   * show sms resend pass timer
   */
  function showSmsTimer() {

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
  }
  setDeafault();

  // VALIDATION

  /**
   * validate form for amount of filled required felds
   * @param $form - form dom
   */
  function chkform1($form) {

    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if ($('.js-phone-input', $form).val().length < 17) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else {
      $('.b-button', $form).removeAttr('disabled');
    }
  }

  function chkform2($form) {

    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else {
      $('.b-button', $form).removeAttr('disabled');
    }
  }

  var PASS_SUBMIT_STATUS = false;
  function chkform3($form) {
    var passMask = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    var validPass = passMask.test($('.js-pass', $form).val());

    var $inputBox = $('.js-required', $form).closest('.js-input-box');

    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {

      PASS_SUBMIT_STATUS = false;
      $inputBox.addClass('error');
      $('.b-input__error', $inputBox).html('Заполните поле ввода');

      var $inputBoxFilled = $('.js-required.js-filled', $form).closest('.js-input-box');
      $inputBoxFilled.removeClass('error');

    } else if (!validPass){

      PASS_SUBMIT_STATUS = false;
      var $thisInputBox = $('.js-pass', $form).closest('.js-input-box');
      $thisInputBox.addClass('error');
      $('.b-input__error', $thisInputBox).html('Неверный формат пароля');


    } else if ($('.js-pass', $form).val() != $('.js-pass-repeat', $form).val()){

      PASS_SUBMIT_STATUS = false;
      var $thisInputBox = $('.js-pass-repeat', $form).closest('.js-input-box');
      $thisInputBox.addClass('error');
      $('.b-input__error', $thisInputBox).html('Пароли не совпадают');


    } else {

      PASS_SUBMIT_STATUS = true;
      $('.js-pass', $form).removeClass('error');
      $('.js-pass-repeat', $form).removeClass('error');

    }
  }

  /**
   * set status filled of value more than 0
   */
  $('input, textarea', $form1).on('keyup paste change input', function () {
    var $this = $(this);

    commonFormsInputsChanging($this, this);

    // check form
    chkform1($form1);
  });

  $('input, textarea', $form2).on('keyup paste change input', function () {
    var $this = $(this);

    commonFormsInputsChanging($this, this);

    // check form
    chkform2($form2);
  });

  $('input, textarea', $form3).on('keyup paste change input', function () {
    var $this = $(this);

    if ($form3.hasClass('show-error'))
      $form3.removeClass('show-error');

    commonFormsInputsChanging($this, this);

    // check form
    chkform3($form3);
  });

  /**
   * submit form
   */
  $form1.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);

    submitForm($this, $this.serialize(), $form2);
    return false;
  });

  $form2.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);

    submitForm($this, $this.serialize(), $form3);
    return false;
  });

  $form3.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    chkform3($form3);

    var $this = $(this);

    if (PASS_SUBMIT_STATUS){
      submitFormLast($this, $this.serialize());
    } else {
      $this.addClass('show-error');
    }

    return false;
  });

  /**
   * submit Enter Form
   * @param $this
   * @param data
   */
  function submitForm($this, data, $nextForm) {
    $.ajax({
      url: $this.attr('action'),
      method: "POST",
      data: data,
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessForm($this, $nextForm) : showErrorFields($this, data.error)
      },
      error: function () {
        // showError($this);
        showSuccessForm($this, $nextForm);
      }
    });
  }

  /**
   * submit Enter Form
   * @param $this
   * @param data
   */
  function submitFormLast($this, data) {
    $.ajax({
      url: $this.attr('action'),
      method: "POST",
      data: data,
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessLast(data.success) : showErrorFields($this, data.error)
      },
      error: function () {
        showError($this);
      }
    });
  }

  /**
   * success form 1 and 2
   */
  function showSuccessForm($this, $nextForm) {
    $this.addClass('hidden');
    $nextForm.removeClass('hidden');
  }

  /**
   * success last form for redirect
   * @param url
   */
  function showSuccessLast(url) {
    window.location.assign(url);
  }

});