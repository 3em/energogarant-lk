$(function () {

  var $clinicList = $('.js-clinics-list');
  var $body = $('body');
  var $tooltip = $('.js-tooltip');
  var $tooltipClose = $('.js-tooltip-close');
  var $filterForm = $('.js-filter-form');
  var filterAmounts = 0;
  var $filterCall = $('.js-filter-call');
  var $filterClose = $('.js-filter-close');
  var $filterReset = $('.js-filter-reset');
  var $cityChooseForm = $('.js-city-choose');
  var $cityCall = $('.js-city-call');
  var $cityClose = $('.js-city-choose-close');
  var windowHeight = $(window).height();
  var windowWidth = $(window).width();
  var $burgerCall = $('.js-burger-call');
  var $tooltipAccordion = $('.js-tooltip-accordion');


  var clusterer;
  var filterList = '';
  var baloonUrl = "/offices/baloon/___ID___/";
  var points = {};
  var geoObjects = [];
  var gocodeName = "Россия, Москва";

  var clinicsArr = [{
    "id": 1,
    "altitude": "37.4161430000000000",
    "longitude":"55.6804480000000000",
    "title": "Клиника семейная",
    "phone": "+7 (495) 662-58-85",
    "address": "Большая Серпуховская ул., 30, стр. 1"
  },{
    "id": 2,
    "altitude": "37.7117790000000000",
    "longitude":"55.7973770000000000",
    "title": "Клиника Здоровья",
    "phone": "+7 (495) 150-35-55",
    "address": "Климентовский пер., 6"
  },{
    "id": 3,
    "altitude": "37.3480330000000000",
    "longitude":"55.8530560000000000",
    "title": "MEDSWISS",
    "phone": "+7 (495) 662-58-85",
    "address": "ул. Ленивка, 4/8"
  }];


  /**
   * tooltip accordion
   */
  $tooltipAccordion.on('click', function (e) {
    e.preventDefault();

    $(this).toggleClass('close');
    $('.js-tooltip-accordion-hide').toggleClass('mob-hidden');
  });

  /**
   * hide burger if view on map
   */
  function mobileHideBurgerOnMap() {
    var val_top = $('#clinicMap')[0].getBoundingClientRect().top;
    if (windowWidth < 768 && val_top <= $burgerCall.height() && val_top > windowHeight * -1 && !$burgerCall.hasClass('mob-hidden')){
      $burgerCall.addClass('mob-hidden');
    } else if (windowWidth < 768 && (val_top > $burgerCall.height() || val_top < windowHeight * -1 ) && $burgerCall.hasClass('mob-hidden')){
      $burgerCall.removeClass('mob-hidden');
    }
  }
  mobileHideBurgerOnMap();

  /**
   * set def options
   */
  function setDefaultValues() {
    var heightCity = windowHeight - 40;
    $cityChooseForm.css('height', heightCity+'px');
  }
  setDefaultValues();

  $(window).on('resize', function () {
    windowHeight = $(window).height();
    windowWidth = $(window).width();

    setDefaultValues();
    mobileHideBurgerOnMap();
  });

  $(window).on('scroll', function () {
    mobileHideBurgerOnMap();
  });

  /**
   * reset filter
   */
  $filterReset.on('click', function (e) {
    e.preventDefault();

    $('input', $filterForm).prop('checked', false);
    submitFilters();
  });

  /**
   * close filter on click
   */
  $filterClose.on('click', function (e) {
    e.preventDefault();
    closeFilter();
  });

  /**
   * fn close filter box
   */
  function closeFilter() {
    $filterForm.removeClass('open');
  }

  /**
   * filter open
   */
  $filterCall.on('click', function (e) {
    e.preventDefault();

    $filterForm.addClass('open');
  });

  /**
   * checkbox filter map
   */
  $('input', $filterForm).on('change', function () {
    var $self = $(this);
    var $thisSection = $self.closest('.js-filter-section');

    if ($self.hasClass('js-filter-checkbox-main') && $self.is(':checked')){
      $('.js-filter-checkbox', $thisSection).prop('checked', true);
    } else if ($self.hasClass('js-filter-checkbox-main') && !$self.is(':checked')){
      $('.js-filter-checkbox', $thisSection).prop('checked', false);
    }

    checkRegularSectionCheckbox($thisSection);

    submitFilters();

  });

  /**
   * control main checkbox status depends of inside checkbox
   * @param $thisSection
   */
  function checkRegularSectionCheckbox($thisSection) {
    var amountChecked = 0;
    var length = $('input', $thisSection).length - 1;

    $('input', $thisSection).each(function () {
      if (!$(this).hasClass('js-filter-checkbox-main') && $(this).is(':checked')){
        amountChecked++;
      }
    });

    if (amountChecked < length){
      $('.js-filter-checkbox-main', $thisSection).prop('checked', false);
    } else if (amountChecked == length){
      $('.js-filter-checkbox-main', $thisSection).prop('checked', true);
    }
  }

  /**
   * submit frm filters
   */
  function submitFilters() {
    filterList = '';
    var form_data = {
      "formData": $filterForm.serializeArray(),
      "gocodeName": gocodeName
    };
    var action = $filterForm.attr('action');

    // $.get(action, form_data, function (data) {

      // array of id of points
      var data = [2,3];

      $.each(points, function (id, value) {
        clusterer.remove(value.placemark);
        id = parseInt(id);
        if (data.indexOf(id) > -1) {
          clusterer.add(value.placemark);
        }
      });

      filterAmount();
    // });
  }

  /**
   * set amount of used filters
   */
  function filterAmount() {
    filterAmounts = 0;
    $('input', $filterForm).each(function () {
      if (!$(this).hasClass('js-filter-checkbox-main') && $(this).is(':checked')){
        filterAmounts++;
      }
    });

    $('span', $filterCall).html(filterAmounts);
    filterAmounts > 0 ? $filterCall.addClass('active') : $filterCall.removeClass('active');
  }

  /**
   * set clinics list
   */
  function setListClinics() {
    $clinicList.html('');

    if (typeof clinicsArr != 'undefined') {
      $.each(clinicsArr, function (key, data) {

        $clinicList.append(
          '<li data-id="'+data.id+'" class="js-clinics-list-item b-clinics-list__item">'+
            '<h6>'+data.title+'</h6>'+
            '<span>'+data.address+'</span>'+
            '<a href="tel:'+data.phone+'" class="b-clinics-list__tel">'+data.phone+'</a>'+
          '</li>'
        );

      });
    }
  }

  /**
   * click on close links popup
   */
  $body.on('click', '.js-popup-office-close', function (e) {
    e.preventDefault();
    closeMapPopup();
  });
  $tooltipClose.on('click', function (e) {
    e.preventDefault();
    closeMapPopup();
  });

  /**
   * click on list clinics item
   */
  $body.on('click', '.js-clinics-list-item', function (e) {
    e.preventDefault();
    var thisId = $(this).attr('data-id');

    $.each(geoObjects, function (id, value) {
      var thisGeoId = value.properties.get('name');
      if (thisGeoId == thisId){
        value.events.fire('click');
        return false;
      }
    });
  });

  /**
   * func close office
   */
  function closeMapPopup() {
    if ($('#clinics-map').is(':visible')){
      $('.b-tooltip-init .close').trigger('click');
      closeTooltip();
    }
  }

  /**
   * init map
   */
  function initMap() {
    ymaps.ready(function () {

      var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="b-tooltip-init" style="position: absolute">' +
        '<a class="close" href="#">&times;</a>'+
        '$[[options.contentLayout observeSize]]' +
        '</div>', {
          /**
           * Builds an instance of a layout based on a template and adds it to the parent HTML
           * element.
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
           * @function
           * @name build
           */
          build: function () {
            this.constructor.superclass.build.call(this);

            this._$element = $('.b-tooltip-init', this.getParentElement());

            this.applyElementOffset();

            this._$element.find('.close')
              .on('click', $.proxy(this.onCloseClick, this));
          },

          /**
           * Removes the layout contents from DOM.
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
           * @function
           * @name clear
           */
          clear: function () {
            this._$element.find('.close')
              .off('click');

            this.constructor.superclass.clear.call(this);
          },

          /**
           * The method will be invoked by the API's template system when resizing the nested
           * layout.
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
           * @function
           * @name onSublayoutSizeChange
           */
          onSublayoutSizeChange: function () {
            MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

            if(!this._isElement(this._$element)) {
              return;
            }

            this.applyElementOffset();

            this.events.fire('shapechange');
          },

          /**
           * Moving the balloon so the "tail" points at the anchor point.
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
           * @function
           * @name applyElementOffset
           */
          applyElementOffset: function () {
            var height = $(".b-tooltip", this._$element[0]).outerHeight();
            this._$element.css({
              left: 0,
              top: 0
            });
          },

          /**
           * Closes the balloon when the "x" is clicked, throwing the "userclose" event on the
           * layout.
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
           * @function
           * @name onCloseClick
           */
          onCloseClick: function (e) {
            e.preventDefault();

            this.events.fire('userclose');
          },

          /**
           * Used for autopositioning (balloonAutoPan).
           * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
           * @function
           * @name getClientBounds
           * @returns  {Number[][]} The coordinates of the top left and bottom right corners of the template relative to the anchor point.
           */
          getShape: function () {
            if(!this._isElement(this._$element)) {
              return MyBalloonLayout.superclass.getShape.call(this);
            }

            var position = this._$element.position();
            var width = (windowWidth > 767 ) ? $(".b-map-close", this._$element[0]).outerWidth() : parseInt(windowWidth / 2);
            var height = (windowWidth > 767 ) ? $(".b-map-close", this._$element[0]).outerHeight() : parseInt(windowHeight / 2 +100);

            return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
              [position.left-100, -height], [position.left + width, position.top + height]
            ]));
          },

          /**
           * Checking the availability of the item (in IE and Opera it might not be there
           * yet).
           * @function
           * @private
           * @name _isElement
           * @param  {jQuery} [element] Element.
           * @returns  {Boolean} Availability flag.
           */
          _isElement: function (element) {
            return element && element[0];
          }
        });


      var MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass('$[properties.balloonContent]');

      $.each(clinicsArr, function (key, data) {
        points[data.id] = {
          visible: true,
          baloon: false,
          placemark: new ymaps.Placemark([data.longitude, data.altitude],
            {name: data.id, title: data.title, phone: data.phone, address: data.address},
            {
              iconLayout: 'default#imageWithContent',
              iconImageHref: '/energogarant-lk/i/i-map-point.svg',
              iconImageSize: [184, 184],
              iconImageOffset: [-92, -92],
              openEmptyBalloon: true,
              balloonShadow: false,
              balloonLayout: MyBalloonLayout,
              balloonContentLayout: MyBalloonContentLayout,
              balloonPanelMaxMapArea: 0
            })
        };
      });

      var myGeocoder = ymaps.geocode(gocodeName);

      myGeocoder.then(
        function (res) {
          var coords = res.geoObjects.get(0).geometry.getCoordinates();
          var bounds = res.geoObjects.get(0).properties.get('boundedBy');

          myMap = new ymaps.Map('clinics-map', {
            center: coords,
            zoom: 10,
            controls: []
          }, {
            searchControlProvider: 'yandex#search'
          });

          myMap.controls.add(
            'zoomControl', {
              position: {
                top: 20,
                left: 15
              }
            }
          ).add('geolocationControl', {
            position: {
              top: 20,
              right: 15
            }
          });

          myMap.behaviors.disable('scrollZoom');

          var MyIconContentLayout = ymaps.templateLayoutFactory
            .createClass('<div style="color: #FFFFFF; font-family: GothamPro-Black; font-size: 22px; line-height: 156px; vertical-align: top;">$[properties.geoObjects.length]</div>');

          clusterer = new ymaps.Clusterer({
            clusterIcons: [{
              href: '/energogarant-lk/i/i-cluster.svg',
              size: [184, 184],
              offset: [-92, -92]
            }],
            clusterIconContentLayout: MyIconContentLayout
          });

          geoObjects = [];

          $.each(points, function (id, value) {
            var thisData = value.placemark;
            geoObjects.push(thisData);
            thisData.events.add('click', myMapPlacemarkClick);
          });

          clusterer.add(geoObjects);
          myMap.geoObjects.add(clusterer);
          myMap.setBounds(clusterer.getBounds(), {checkZoomRange: true});
        }
      );

      setListClinics();

    });
  }
  initMap();


  /**
   * click on placemark and show popup
   * @param e
   */
  function myMapPlacemarkClick(e) {
    var placemark = e.get('target');

    var id = placemark.properties.get('name');
    var url = baloonUrl.replace('___ID___', id);

    // get data for office popup
    $.get(url, function (data) {

    });

    // set to get
    closeFilter();
    placemark.properties.set('balloonContent', '<div class="js-popup-office-close b-map-close" style="position: absolute; width: 140px; height: 130px; left: 50%; margin-left: -5px; top: -75px; background: url(/energogarant-lk/i/i-map-point-open.svg); background-size: cover; transform: translate(-50%,0)"></div>');
    openTooltip()
  }

  /**
   * open tooltip
   */
  function openTooltip() {
    $tooltip.addClass('open');
  }

  /**
   * close toolTip
   */
  function closeTooltip() {
    $tooltip.removeClass('open');
    $tooltipAccordion.removeClass('close');
    $('.js-tooltip-accordion-hide').removeClass('mob-hidden');
  }


  // custom select for countries

  $.widget( "custom.combobox", {
    _create: function() {
      this.wrapper = $( "<div class='js-input-box b-input__box'>" )
        .addClass( "custom-combobox" )
        .insertAfter( this.element );

      this.element.hide();
      this._createAutocomplete();
    },

    _createAutocomplete: function() {
      var selected = this.element.children( ":selected" ),
        value = selected.val() ? selected.text() : "";

      this.wrapper.append('<label for="citySearch" class="b-input__label">Мой город</label>');

      this.input = $( "<input id='citySearch' class='js-input b-input'>" )
        .appendTo( this.wrapper )
        .val( value )
        .attr( "title", "" )
        .addClass( "custom-combobox-input ui-widget ui-widget-content ui-state-default ui-corner-left" )
        .focusout(function () {
          submitCityChoose();
        })
        .autocomplete({
          delay: 0,
          minLength: 0,
          source: $.proxy( this, "_source" ),
          appendTo: this.wrapper,
          select: function () {
            $(':focus').blur();
          }
        });

      var thisInput = this.input;

      this._on( this.input, {
        autocompleteselect: function( event, ui ) {
          ui.item.option.selected = true;
          this._trigger( "select", event, {
            item: ui.item.option
          });

          setTimeout(function () {
            thisInput.trigger('change');
          }, 10)
        },

        autocompletechange: "_removeIfInvalid"
      });
    },

    _source: function( request, response ) {
      var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), "i" );
      response( this.element.children( "option" ).map(function() {
        var text = $( this ).text();


        if ( this.value && ( !request.term || matcher.test(text) ) ){
          return {
            label: text,
            value: text,
            option: this
          };
        }

      }) );
    },

    _removeIfInvalid: function( event, ui ) {

      // Selected an item, nothing to do
      if ( ui.item ) {
        return;
      }

      // Search for a match (case-insensitive)
      var value = this.input.val(),
        valueLowerCase = value.toLowerCase(),
        valid = false;
      this.element.children( "option" ).each(function() {
        if ( $( this ).text().toLowerCase() === valueLowerCase ) {
          this.selected = valid = true;
          return false;
        }
      });

      // Found a match, nothing to do
      if ( valid ) {
        return;
      }

      // Remove invalid value
      this.input
        .val( "" )
        .attr( "title", value + " didn't match any item" );
      $('#citySearch').trigger('change');
      this.element.val( "" );
      this._delay(function() {
        // can hide with delay
      }, 2500 );
      this.input.autocomplete( "instance" ).term = "";
    },

    _destroy: function() {
      this.wrapper.remove();
      this.element.show();
    }
  });

  $( "#combobox" ).combobox();

  /**
   * submit city choose
   */
  function submitCityChoose() {

    setTimeout(function () {

      var valCity = $('#citySearch').val();
      if (valCity.length > 0){
        var action = $cityChooseForm.attr('action');
        var form_data = [valCity];

        clinicsArr = [];
        filterList = '';
        points = {};
        geoObjects = [];




        $.get(action, form_data, function (data) {

        });

        gocodeName = "Россия, Санкт-Петербург";
        clinicsArr = [{
          "id": 2,
          "longitude":"59.84731775838757",
          "altitude": "30.031802499999955",
          "title": "ж/д станция Стрельна",
          "phone": "+7 (495) 150-35-55",
          "address": "Россия, Санкт-Петербург, Петродворцовый район, посёлок Стрельна"
        }];
        myMap.destroy();
        initMap();
        $('input', $filterForm).prop('checked', false);
        filterAmount();
        $cityCall.html(valCity);
        closeCityChoose();
      }

    }, 100);

  }

  /**
   * close city on click
   */
  $cityClose.on('click', function (e) {
    e.preventDefault();
    closeCityChoose();
  });

  /**
   * open city choose popup
   */
  $cityCall.on('click', function (e) {
    e.preventDefault();
    $cityChooseForm.addClass('open');
    $('#citySearch').focus();
  });

  /**
   * close city choose form
   */
  function closeCityChoose() {
    $cityChooseForm.removeClass('open');
    $('input', $cityChooseForm).val('');
  }

});