$(function () {

  var $form = $('.js-payment-form');
  var $formSuccess = $('.js-payment-success');
  var $paymentPopupCall =  $('.js-payment-docs-link');
  var $body = $('body');
  var $overlay = $('.js-overlay');
  var $paymentPopup = $('.js-popup-payment');
  var $paymentId = $('.js-payment-id');
  var $paymentsDocsListInsert = $('.js-payment-form-list');
  var thisPaymentId;

  /**
   * open popup payment and set some values from this item
   */
  $paymentPopupCall.on('click', function (e) {
    e.preventDefault();
    $paymentsDocsListInsert.html('');

    var $thisItem = $(this).closest('.js-payment-docs-item');
    thisPaymentId = $thisItem.attr('data-id');
    var thisListDocs = $thisItem.attr('data-list').split(";");

    $paymentId.val(thisPaymentId).trigger('change');
    $.each(thisListDocs, function (index, value) {
      $paymentsDocsListInsert.append('<li>'+value+'</li>');
    });

    $overlay.addClass('show');
    $paymentPopup.addClass('show');
    $body.addClass('overflow');
  });

  /**
   * document click events
   */
  $(document).click(function (e) {
    var $target = $(e.target);

    // remove added file
    if ($target.is('.js-file-remove')) {

      setTimeout(function () {
        chkform($form);
      }, 100);
    }

  });

  /**
   * validate form for amount of filled required felds
   * @param $form - form dom
   */
  function chkform($form) {

    var fileItemsLength = $('.js-file-item', $form).length;

    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if (fileItemsLength == 0){
      $('.b-button', $form).attr('disabled', 'disabled');
    } else {
      $('.b-button', $form).removeAttr('disabled');
    }
  }

  /**
   * set status filled of value more than 0
   */
  $('input, textarea', $form).on('keyup paste change input', function () {
    var $this = $(this);

    commonFormsInputsChanging($this, this);

    // check form
    chkform($form);
  });

  /**
   * submit form
   */
  $form.on('submit', function(e) {
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

    $form.addClass('hidden');
    $formSuccess.removeClass('hidden');

    $form[0].reset();
    $('.js-link-stop', $form).html('');
    $('.b-dropdown__sub li', $form).removeClass('hidden active');
    $('.js-file-insert', $form).html('').addClass('hidden');
    $('input, textarea', $form).trigger('change');

    var $currentItem = $('.js-payment-docs-item[data-id="'+thisPaymentId+'"]');
    $('.b-offer-payment__status', $currentItem).html('Рассмотрение');

    $('.js-file', $form).each(function () {
      var thisFileId = $(this).attr('id');
      fileArray[thisFileId] = [];
    });
  }

});