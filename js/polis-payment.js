$(function () {

  var $firstPolisForm =  $('.js-first-polis-payment');
  var $secondPolisForm = $('.js-second-polis-payment');
  var $anotherPolisBox =  $('.js-another-polis');
  var $content = $('.b-content');
  var CHANGE_WORD = 'Другой полис';
  var $periodDropdown = $('.js-period-dropdown');
  var $priceTextInsert = $('.js-price-text-insert');
  var $priceInsert = $('.js-price-insert');
  var $priceInputInsert = $('.js-price-input-insert');
  var $polisNumberInput = $('.js-polis-number-input');

  var TEXT_PRICE = 'Итого к оплате';
  var FAKE_LIST = [{
      'title': 'За 1 месяц – по Август 2018',
      'price': 25400
    }, {
      'title': 'За 2 месяца – по Сентябрь 2018',
      'price': 32900
    }, {
      'title': 'За 3 месяца – по Октябрь 2018',
      'price': 45000
  }];


  /**
   * fill bottom price and period html with JSON
   */
  function fillPeriodPriceBlock(list) {
    var listLength = list.length;

    $periodDropdown.addClass('hidden');
    $('.b-dropdown__sub', $periodDropdown).html('');
    $('.js-link-stop', $periodDropdown).html('');
    $('.js-input-for-select', $periodDropdown).removeClass('js-required').val('').trigger('change');

    $.each(list, function (el) {
      var thisItem = list[el];

      if (listLength > 1){
        $periodDropdown.removeClass('hidden');
        $('.b-dropdown__sub', $periodDropdown).append('<li data-price="'+thisItem.price+'" class="b-dropdown__item">'+thisItem.title+'</li>')
        $priceTextInsert.html(TEXT_PRICE);
        $priceInsert.html('');
        $priceInputInsert.val('').trigger('change');
        $('.js-input-for-select', $periodDropdown).addClass('js-required');
      } else {
        $priceTextInsert.html(thisItem.title);
        $priceInsert.html(formating(thisItem.price) + ' <span class="b-rub">c</span>');
        $priceInputInsert.val(thisItem.price).trigger('change');
      }
    })
  }

  /**
   * document click events
   */
  $(document).click(function (e) {
    var $target = $(e.target),
      $parent = undefined;

    // dropdown behaviour
    if ($target.is('.b-dropdown *')) {
      $parent = $target.parents('.b-dropdown__box');

      // period dropdown
      if ($target.is('.b-dropdown__item') && $parent.hasClass('js-period-dropdown')) {
        var price = $target.attr('data-price');
        $priceInsert.html(formating(price) + ' <span class="b-rub">c</span>');
        $priceInputInsert.val(price).trigger('change');
      }

      // polis dropdown
      if ($target.is('.b-dropdown__item') && $parent.hasClass('js-polis-dropdown')) {

        if ($target.html() != CHANGE_WORD){

          submitFirstForm();
        }
      }

    }
  });

  /**
   * submit first form
   */
  function submitFirstForm() {
    $firstPolisForm.addClass('submitted');
    var dataForm = $firstPolisForm.serialize();
    $.ajax({
      url: $firstPolisForm.attr('action'),
      processData: false,
      contentType: false,
      method: "POST",
      data: dataForm,
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessFirstForm() : showErrorFields($firstPolisForm, data.error)
      },
      error: function () {
        // showError($firstPolisForm);
        showSuccessFirstForm();
      }
    });
  }

  /**
   * first form success and show second form
   */
  function showSuccessFirstForm(data) {
    // fake list for example
    var data = FAKE_LIST;
    fillPeriodPriceBlock(data);
    $secondPolisForm.removeClass('hidden');
  }


  /**
   * onload settings
   */
  function defaultSettings() {

    // set height content
    var heightDropDownFirst = $('.b-dropdown__sub', $firstPolisForm).outerHeight(true);
    var contentHeight = $content.outerHeight(true) - 120;
    var setHeight = heightDropDownFirst + contentHeight;
    $content.css('min-height', setHeight+'px');
  }
  defaultSettings();


  /**
   * first step dropdown behaviour
   */
  $('.js-input-for-select', $firstPolisForm).on('change', function () {
    var thisVal = $(this).val();

    if (thisVal == CHANGE_WORD){
      $anotherPolisBox.removeClass('hidden');
      $('input', $anotherPolisBox).addClass('js-required');
    } else {
      $anotherPolisBox.addClass('hidden');
      $('input', $anotherPolisBox).val('').trigger('change').removeClass('js-required');
      $polisNumberInput.val(thisVal).trigger('change')
    }
  });

  /**
   * set polis number to second form if another choose on first form
   */
  $('input', $anotherPolisBox).on('keyup paste change input', function () {
    if ($firstPolisForm.hasClass('submitted'))
      $firstPolisForm.removeClass('submitted');

    if (!$secondPolisForm.hasClass('hidden'))
      $secondPolisForm.addClass('hidden');
    
    var thisVal = $(this).val();
    $polisNumberInput.val(thisVal).trigger('change');
  });

  /**
   * validate form for amount of filled required felds
   * @param $form - form dom
   */
  function chkformFirst($form) {

    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else {
      $('.b-button', $form).removeAttr('disabled');
    }
  }

  /**
   * set status filled of value more than 0
   */
  $('input, textarea', $firstPolisForm).on('keyup paste change input', function () {
    var $this = $(this);

    commonFormsInputsChanging($this, this);

    // check form
    chkformFirst($firstPolisForm);
  });

  /**
   * submit form
   */
  $firstPolisForm.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    submitFirstForm();
    return false;
  });

  /**
   * validate form for amount of filled required felds
   * @param $form - form dom
   */
  function chkformSecond($form) {
    var emailMask = /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-zA-Z0-9]{1}[a-zA-Z0-9\-]{0,62}[a-zA-Z0-9]{1})|[a-zA-Z])\.)+[a-zA-Z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/;
    var validEmail = emailMask.test($('.js-email-input', $form).val());


    if ($('.js-required.js-filled', $form).length < $('.js-required', $form).length) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if ($('.js-phone-input', $form).val().length < 17) {
      $('.b-button', $form).attr('disabled', 'disabled');
    } else if (!validEmail){
      $('.b-button', $form).attr('disabled', 'disabled');
    } else {
      $('.b-button', $form).removeAttr('disabled');
    }
  }

  /**
   * set status filled of value more than 0
   */
  $('input, textarea', $secondPolisForm).on('keyup paste change input', function () {
    var $this = $(this);

    commonFormsInputsChanging($this, this);

    // check form
    chkformSecond($secondPolisForm);
  });

  /**
   * submit form
   */
  $secondPolisForm.on('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();

    var $this = $(this);

    submitSecondForm($this, $this.serialize());
    return false;
  });

  /**
   * submit Registration Form
   * @param $this
   * @param data
   */
  function submitSecondForm($this, data) {
    $.ajax({
      url: $this.attr('action'),
      method: "POST",
      data: data,
      dataType: "JSON",
      success: function (data) {
        data.result === 'ok' ? showSuccessSecondForm() : showErrorFields($this, data.error)
      },
      error: function () {
        showError($this);
      }
    });
  }

  /**
   * show success second
   * @param url - for redirect
   */
  function showSuccessSecondForm(url){
    window.location.assign(url);
  }

});