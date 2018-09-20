$(function () {

  var $body = $('body');
  var $changeLkLink = $('.js-change-lk-link');
  var $lkMain = $('.js-lk');
  var $dateInput = $('.js-date');
  var $userpicInput = $('.js-userpic-input');
  var $userpicLabel = $('.js-userpic-label');
  var $lkMainForm = $('.js-lk-form-main');
  var $lkInputField = $('.js-lk-field');
  var $file = $('.js-file', $lkMain);
  var $lkDocsAdd = $('.js-lk-docs-add');
  var $lkFormDocs = $('.js-lk-form-docs');
  var $localPassportInput = $('.js-local-passport');
  var $unitCodeInput = $('.js-unit-code');
  var $accordionDocLink = $('.js-lk-docs-accordion-link');
  var $lkDocsItem = $('.js-lk-docs-item ');
  var $changePassPopup = $('.js-change-pass-popup');
  var $changePassForm = $('.js-change-pass');
  var $changePassFormSuccess = $('.js-change-pass-success');
  var $changePassCall = $('.js-change-pass-link');
  var $overlay = $('.js-overlay');

  /**
   * change pass popup open
   */
  $changePassCall.on('click', function (e) {
    e.preventDefault();

    $overlay.addClass('show');
    $changePassPopup.addClass('show');
    $body.addClass('overflow');
  });

  /**
   * submit form
   */
  $changePassForm.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);

    submitPassForm($this, $this.serialize());
    return false;
  });

  /**
   * submit Enter Form
   * @param $this
   * @param data
   */
  function submitPassForm($this, data) {
    $.ajax({
      url: $this.attr('action'),
      method: "POST",
      data: data,
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessPassForm($this) : showErrorFields($this, data.error)
      },
      error: function () {
        // showError($this);
        showSuccessPassForm($this);
      }
    });
  }

  /**
   * show success change pass form
   * @param $form
   */
  function showSuccessPassForm($form) {
    $changePassFormSuccess.removeClass('hidden');
    $form.addClass('hidden');

    $form[0].reset();
    $('input, textarea', $form).trigger('change');
  }

  /**
   * check form change pass
   * @param $form
   */
  function chkformChangePass($form) {
    var passMask = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    var validPass = passMask.test($('.js-pass', $form).val());

    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if (!validPass){
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if ($('.js-pass', $form).val() != $('.js-pass-repeat', $form).val()){
      $('.b-button', $form).attr('disabled', 'disabled');
    } else {
      $('.b-button', $form).removeAttr('disabled');
    }
  }

  /**
   * set status filled of value more than 0
   */
  $('input, textarea', $changePassForm).on('keyup paste change input', function () {
    var $this = $(this);

    commonFormsInputsChanging($this, this);

    // check form
    chkformChangePass($changePassForm);
  });

  /**
   * accordion docs link
   */
  $accordionDocLink.on('click', function (e) {
    e.preventDefault();

    var $thisDocsItem = $(this).closest('.js-lk-docs-item');
    var $thisDocsAccordion = $('.js-lk-form-accordion', $thisDocsItem);

    if (!$thisDocsItem.hasClass('empty')){
      $thisDocsAccordion.slideToggle(250);
      $thisDocsItem.toggleClass('open');
    }
  });


  // masks
  $localPassportInput.mask('0000 000000');
  $unitCodeInput.mask('000-000');

  /**
   * show form on empty docs link click
   */
  $lkDocsAdd.on('click', function (e) {
    e.preventDefault();

    var $thisDocsItem = $(this).closest('.js-lk-docs-item');
    var $thisDocsAccordion = $('.js-lk-form-accordion', $thisDocsItem);

    $thisDocsAccordion.slideToggle(250);
    $thisDocsItem.toggleClass('open');
  });

  /**
   * file on change check insert empty class
   */
  $file.on('change', function () {
    checkFilesInsertEmpty($(this))
  });

  /**
   * fnc to check empty class
   * @param $this
   */
  function checkFilesInsertEmpty($this) {
    var $thisLkField = $this.closest('.js-lk-field-file');
    var $thisFileInsert = $('.js-file-insert', $thisLkField);

    if ($thisFileInsert.html().replace(/[^-0-9]/gim,'') != ''){
      $thisLkField.removeClass('empty');
      $thisFileInsert.removeClass('hidden');
    } else {
      $thisLkField.addClass('empty');
      $thisFileInsert.addClass('hidden');
    }
  }

  /**
   * user pic behaviour
   */
  $userpicInput.on('dragenter', function() {
    var $thisBox = $(this).closest('.js-userpic-box');
    $thisBox.addClass('drag');
  });
  $userpicInput.on('dragleave drop focusout', function() {
    var $thisBox = $(this).closest('.js-userpic-box');
    $thisBox.removeClass('drag');
  });
  $userpicInput.on('change', function (event) {
    var filesArr = event.target.files;
    var filesArrKeys = Object.keys(filesArr);

    filesArrKeys.forEach(function (el) {
      var file = filesArr[el];
      var picSrc = URL.createObjectURL(file);
      $userpicLabel.css({'background': 'url('+picSrc+') no-repeat center', 'background-size': 'cover'});
    });
  });

  /**
   * toggle change LK
   */
  $changeLkLink.on('click', function (e) {
    e.preventDefault();

    $lkMain.toggleClass('b-lk_edit');
    $lkDocsItem.
    $lkMain.hasClass('b-lk_edit') ? $userpicLabel.attr('name', 'lk_userpic') : $userpicLabel.attr('name', '');
  });

  /**
   * datapicker
   */
  $dateInput.datepicker({
    changeMonth: true,
    changeYear: true,
    regionalOptions: ['ru'],
    useMouseWheel: false,
    yearRange: "1920:2018",
    onSelect: function(dates) {
      $dateInput.trigger('change');
    }
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
  $('input, textarea', $lkMainForm).on('keyup paste change input', function () {
    var $this = $(this);

    commonFormsInputsChanging($this, this);

    // check form
    chkform($lkMainForm);
  });

  /**
   * set status filled of value more than 0
   */
  $('input, textarea', $lkFormDocs).on('keyup paste change input', function () {
    var $this = $(this);
    var $thisForm = $this.closest($lkFormDocs);

    commonFormsInputsChanging($this, this);

    // check form
    chkform($thisForm);
  });

  /**
   * submit form docs
   */
  $lkFormDocs.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);

    submitDoc($this, $this.serialize());
    return false;
  });

  /**
   * submit form
   */
  $lkMainForm.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);

    var formData = new FormData($this[0]);

    submit($this, formData);
    return false;
  });

  /**
   * submit Form
   * @param $this
   * @param data
   */
  function submitDoc($this, data) {
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
        data.result === 'ok' ? showSuccess($this) : showErrorFields($this, data.error)
      },
      error: function () {
        // showError($this);
        showSuccessDocs($this);
      }
    });
  }

  /**
   * submit Form
   * @param $this
   * @param data
   */
  function submit($this, data) {

    $.ajax({
      url: $this.attr('action'),
      processData: false,
      contentType: false,
      method: "POST",
      data: data,
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessDocs($this) : showErrorFields($this, data.error)
      },
      error: function () {
        // showError($this);
        showSuccess();
      }
    });
  }

  /**
   * docs success
   * @param $form
   */
  function showSuccessDocs($form) {
    var $thisDocsItem = $form.closest('.js-lk-docs-item');
    if ($thisDocsItem.hasClass('empty'))
      $thisDocsItem.removeClass('empty');

    $thisDocsItem.addClass('full');

    $('.js-input', $form).each(function () {
      var $thisLkInputField = $(this).closest($lkInputField);
      $('.js-input-val-insert', $thisLkInputField).html($(this).val());
      checkEmptyVals($(this).val(), $thisLkInputField);
    });

  }

  /**
   * success forms
   * @param $form
   */
  function showSuccess($form){
    var $thisSuccess = $('.js-lk-form-success', $form);
    $lkMain.removeClass('b-lk_edit');

    $('.js-input', $form).each(function () {
      var $thisLkInputField = $(this).closest($lkInputField);
      $('.js-input-val-insert', $thisLkInputField).html($(this).val());
      checkEmptyVals($(this).val(), $thisLkInputField);
    });

    $thisSuccess.removeClass('hidden');
    setTimeout(function () {
      $thisSuccess.addClass('hidden');
    }, 3000);
  }

  /**
   * check if input empty add result insert box empty class
   * @param val
   * @param $thisLkInputField
   */
  function checkEmptyVals(val, $thisLkInputField){
    (val != '') ? $thisLkInputField.removeClass('empty') : $thisLkInputField.addClass('empty');
  }

  /**
   * ON LOAD check if input empty add result insert box empty class
   */
  function defaultCheckEmptyFields() {
    $('.js-input', $lkMain).each(function () {
      var $thisLkInputField = $(this).closest($lkInputField);
      checkEmptyVals($(this).val(), $thisLkInputField);
    });

    // file input
    $file.each(function () {
      checkFilesInsertEmpty($(this))
    });
  }
  defaultCheckEmptyFields();

  /**
   * document click events
   */
  $(document).click(function (e) {
    var $target = $(e.target);

    // remove added file
    if ($target.is('.js-file-remove')){
      $file.each(function () {
        checkFilesInsertEmpty($(this))
      });
    }
  })

});