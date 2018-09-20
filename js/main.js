fileArray = {};

$(function () {

  var $body = $('body');
  var $footer = $('.js-footer');
  var $input = $('.js-input');
  var $phoneInput = $('.js-phone-input');
  var $tabLink = $('.js-tab');
  var $tabBox = $('.js-tabs-box');
  var $notificationLink = $('.js-notification-link');
  var $notificationBox = $('.js-notification');
  var $overlay = $('.js-overlay');
  var $popup = $('.js-popup');
  var $popupCommonSuccess = $('.js-form-success-common');
  var $closePopupLink = $('.js-close-popup');
  var $insCasePopup = $('.js-ins-case-popup');
  var $insCaseCall = $('.js-ins-case-call');
  var $burgerCall = $('.js-burger-call');
  var $mobMenu = $('.js-mob-menu');
  var windowWidth = $(window).width();
  var $popupShowBoxOnClose = $('.js-show-part-on-close');
  var $scrollTo = $('.js-scroll-to');
  var $header = $('.js-header');
  var MAGIC_HEADER_OFFSET = 100;

  /**
   * show burger call when scroll under header
   */
  function showBurgerScroll() {
    var scrollTop = $(window).scrollTop();
    var heightHeader = $header.height();

    if (windowWidth > 767 && scrollTop > heightHeader + MAGIC_HEADER_OFFSET && !$burgerCall.hasClass('show')){
      $burgerCall.addClass('show');
    } else if (windowWidth > 767 && scrollTop <= heightHeader + MAGIC_HEADER_OFFSET && $burgerCall.hasClass('show')){
      $burgerCall.removeClass('show');
    }
  }
  showBurgerScroll();

  /**
   * common scroll to link
   */
  $scrollTo.on('click', function (e) {
    e.preventDefault();

    var href = $(this).attr('href');
    scrollTo(href);
  });

  /**
   * burger
   */
  $burgerCall.on('click', function (e) {
    e.preventDefault();

    $(this).toggleClass('open');
    $mobMenu.toggleClass('show');
    $body.toggleClass('overflow open-burger');
  });

  /**
   * ins case open
   */
  $insCaseCall.on('click', function (e) {
    e.preventDefault();

    $overlay.addClass('show');
    $insCasePopup.addClass('show');
    $body.addClass('overflow');
  });

  /**
   * close any popup func
   */
  function closePopup() {
    $overlay.removeClass('show');
    $popup.removeClass('show');
    $body.removeClass('overflow');

    setTimeout(function () {
      $popupShowBoxOnClose.removeClass('hidden');
      $popupCommonSuccess.addClass('hidden');
    }, 250);
  }

  /**
   * close popup if esc
   */
  $(document).keyup(function (e) {
    if (e.which == 27 && $overlay.is(':visible')) {
      closePopup();

    }

    if (e.which == 27 && $burgerCall.hasClass('open')) {
      $burgerCall.removeClass('open');
      $mobMenu.removeClass('show');
      $body.removeClass('overflow open-burger');
    }
  });

  /**
   * close popup link
   */
  $closePopupLink.on('click', function (e) {
    e.preventDefault();
    closePopup();
  });

  /**
   * notification toggle
   */
  $notificationLink.on('click', function (e) {
    e.preventDefault();
    $notificationBox.toggleClass('open');
  });

  /**
   * tab link click
   */
  $tabLink.on('click', function (e) {
    e.preventDefault();

    if (!$(this).hasClass('b-tab_active')){

      var $thisTabBox = $tabLink.closest($tabBox);
      var thisHref = $(this).attr('href').replace('#','');

      $('.js-tab', $thisTabBox).removeClass('b-tab_active');
      $(this).addClass('b-tab_active');
      $('.js-tabs-item', $thisTabBox).addClass('hidden');
      $('.js-tabs-item[data-id='+thisHref+']', $thisTabBox).removeClass('hidden');
    }
  });

  /**
   * set padding to body, depends of footer height
   */
  function setFooterShiftToBody() {
    var footerHeight = $footer.outerHeight(true);
    $body.css('padding-bottom', footerHeight+'px');
  }
  setFooterShiftToBody();

  /**
   * inputs placeholder move
   */
  $(document).on('keyup paste change input', '.js-input', function () {

    var $parent = $(this).closest('.js-input-box');
    if ($(this).val() != '' && !$parent.hasClass('shifted')){
      $parent.addClass('shifted');
    } else if ($(this).val() == '' && $parent.hasClass('shifted')){
      $parent.removeClass('shifted');
    }
  });

  $phoneInput.mask('+7 (000) 000-0000');


  /**
   * dropdown open | close func
   * @param parent
   */
  function toggleDropdown(parent) {
    if (parent.hasClass('b-dropdown_open')) {
      parent.removeClass('b-dropdown_open');
    } else {
      $('.b-dropdown').each(function () {
        if (!$(this).hasClass('first-open')){
          $(this).removeClass('b-dropdown_open');
        }
      });
      parent.addClass('b-dropdown_open');
      $('b-dropdown__text', parent).removeClass('js-link-stop');
    }
  }

  /**
   * add shifted class when input has value
   * @param $input
   * @param $parent
   */
  function checkDropdownValueEmpty($input, $parent) {
    if ($input.val() != '' && !$parent.hasClass('shifted')){
      $parent.addClass('shifted')
    } else if ($input.val() == '' && $parent.hasClass('shifted')){
      $parent.removeClass('shifted')
    }
  }

  /**
   * input file behaviour
   */
  $('.js-file').on('dragenter focus', function() {
    var $thisBox = $(this).closest('.js-file-box');
    $thisBox.addClass('drag');
  });
  $('.js-file').on('dragleave drop focusout', function() {
    var $thisBox = $(this).closest('.js-file-box');
    $thisBox.removeClass('drag');
  });
  $('.js-file').on('change', function (event) {
    var $thisBox = $(this).closest('.js-file-box');
    var thisInputId = $(this).attr('id');
    var filesArr = event.target.files;
    var filesArrKeys = Object.keys(filesArr);

    filesArrKeys.forEach(function (el) {
      var file = filesArr[el];
      var name = file.name;
      var picClass = 'hidden';
      if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif'){
        var picSrc = URL.createObjectURL(file);
        picClass = '';
      }
      var fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      if (!fileArray[thisInputId]){
        fileArray[thisInputId] = [];
      }

      fileArray[thisInputId].push(fileReader);

      var id = fileArray[thisInputId].length-1;

      if (file.size <= 10000000){
        $('.js-file-insert', $thisBox).append('<li data-id="'+id+'" class="js-file-item b-input-file__item">'+
          '<img src="'+picSrc+'" alt="" class="'+picClass+'">'+
          '<div class="u-clear-fix">'+
          '<span>'+name+'</span>'+
          '<a href="#" class="js-file-remove">удалить</a>'+
          '</div>'+
          '</li>').removeClass('hidden');
      }
    });

    $(this).val('');
  });

  /**
   * textarea height with content text
   */
  var defHeight = 0;
  $('textarea').each(function () {
    this.setAttribute('style', 'height:' + (this.scrollHeight) + 'px;overflow-y:hidden;');
    defHeight = this.scrollHeight;
  }).on('keyup paste change input', function () {
    this.style.height = '0';
    if ($(this).val() != ''){
      this.style.height = (this.scrollHeight) + 'px';
    } else {
      this.style.height = (defHeight) + 'px';
    }
  });

  /**
   * document click events
   */
  $(document).click(function (e) {
    var $target = $(e.target),
      $parent = undefined;

    // dropdown behaviour
    if ($target.is('.b-dropdown *')) {
      $parent = $target.parents('.b-dropdown');
      if ($target.is('.b-dropdown__item')) {
        $('.b-dropdown__item', $parent).removeClass('hidden active');
        $parent.removeClass('b-dropdown__first').removeClass('first-open');
        $target.addClass('hidden active');
        $('.b-dropdown__text', $parent).html($target.html()).addClass('js-link-stop');

        var $thisInputForSelect = $('.js-input-for-select', $parent.closest('.b-dropdown__box'));

        if ($target.data('letter') != undefined){
          $thisInputForSelect.val($target.data('letter')).trigger('change');
        } else {
          $thisInputForSelect.val($target.text()).trigger('change');
        }

        checkDropdownValueEmpty($thisInputForSelect, $parent);

        // if data-link go by url
        if ($target.data('link') != undefined)
          window.location = $target.data('link');
      }
      toggleDropdown($parent)
    } else {
      $('.b-dropdown').each(function () {
        if (!$(this).hasClass('first-open')){
          $(this).removeClass('b-dropdown_open');
        }
      })
    }

    // remove added file
    if ($target.is('.js-file-remove')){
      e.preventDefault();
      var $thisFileBox = $target.closest('.js-file-box');
      var thisFileClass = $('.js-file', $thisFileBox).attr('id');
      var $thisItemFile = $target.closest('.js-file-item');
      var id = $thisItemFile.attr('data-id');

      if (fileArray[thisFileClass] && fileArray[thisFileClass][id])
        delete fileArray[thisFileClass][id];

      $thisItemFile.remove();
      checkFilesEmpty($thisFileBox);
    }
  });

  /**
   * set hidden to file insert box if empty
   * @param $fileBox
   */
  function checkFilesEmpty($fileBox) {
    if ($('.js-file-item', $fileBox).length == 0){
      $('.js-file-insert', $fileBox).addClass('hidden');
    }
  }



  $(window).on('resize', function () {
    setFooterShiftToBody();
    windowWidth = $(window).width();
    showBurgerScroll();
  });

  $(window).on('scroll', function () {
    showBurgerScroll();
  });

});

/**
 * declension words
 */
declension = function(number, one, two, five) {
  number = Math.abs(number);
  number %= 100;
  if (number >= 5 && number <= 20) {
    return five;
  }
  number %= 10;
  if (number == 1) {
    return one;
  }
  if (number >= 2 && number <= 4) {
    return two;
  }
  return five;
};

/**
 * common inputs behaviour
 * @param $this
 */
commonFormsInputsChanging = function ($thisElem, $this) {
  //reset error class
  var $thisInputBox = $thisElem.closest('.js-input-box');
  if ($thisInputBox.hasClass('error'))
    $thisInputBox.removeClass('error');

  //set filled class
  $this.value.length > 0 ? $thisElem.addClass('js-filled') : $thisElem.removeClass('js-filled');
};

/**
 * show error from fields
 */
showErrorFields= function ($this, error){
  // example of error
  // key - это id инпута
  // value - текст ошибки или пустая строка, если нет ошибки
  console.log('error');
  var error = {
    'enter_phone': 'Неверный номер телефона',
    'enter_pass': ''
  };

  var arr = Object.keys(error);
  arr.forEach(function (el) {
    if (error[el] != ''){
      var $thisInputBox = $('#'+el, $this).closest('.js-input-box');
      $thisInputBox.addClass('error');
      $('.b-input__error', $thisInputBox).html(error[el]);
    }
  });
};

/**
 * show error text
 * @param text
 */
showError = function ($this) {
  $('.js-form-error', $this).removeClass('hidden');
  setTimeout(function () {
    $('.js-form-error', $this).addClass('hidden');
  }, 3000)
};

/**
 * format price
 * @param val
 * @returns {string}
 */
formating = function(val) {
  return String(val).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
};

/**
 * scroll to block
 * @param selector
 */
scrollTo = function(selector, offset, scrollElem, position) {
  setTimeout(function () {
    !offset ? offset = 0 : offset;
    if (!position == true){
      var scroll = $(selector).offset().top - offset;
    } else {
      var scroll = $(selector).position().top - offset;
    }

    if (!scrollElem){
      scrollElem = $('html,body');
    }
    scrollElem.animate({
      scrollTop: scroll
    }, 500);
  }, 10);
};