$(function () {

  var $clinicTab = $('.js-clinics-tab');
  var $clinicTabLink = $('.js-clinics-tab-link');

  var points = {};
  var gocodeName = "Россия, Москва";
  var clinicsArr = [{
    "id": 1,
    "altitude": "37.4161430000000000",
    "longitude":"55.6804480000000000"
  },{
    "id": 2,
    "altitude": "37.7117790000000000",
    "longitude":"55.7973770000000000"
  },{
    "id": 3,
    "altitude": "37.3480330000000000",
    "longitude":"55.8530560000000000"
  }];

  /**
   * clinic mobile tabs
   */
  $clinicTabLink.on('click', function (e) {
    e.preventDefault();

    if (!$(this).hasClass('active')){
      var thisHref = $(this).attr('href');
      $clinicTab.addClass('mob-hidden');
      $clinicTabLink.removeClass('active');
      $(this).addClass('active');
      $(thisHref).removeClass('mob-hidden');
    }
  });


  ymaps.ready(function () {

    $.each(clinicsArr, function (key, data) {
      points[data.id] = {
        visible: true,
        baloon: false,
        placemark: new ymaps.Placemark([data.longitude, data.altitude], {name: data.id}, {
          iconLayout: 'default#imageWithContent',
          iconImageHref: 'i/i-map-point.svg',
          iconImageSize: [196, 196],
          iconImageOffset: [-98, -98]
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
          .createClass('<div style="color: #FFFFFF; font-family: "FuturaPT-Demi"; font-size: 20px;">$[properties.geoObjects.length]</div>');

        clusterer = new ymaps.Clusterer({
          clusterIcons: [{
            href: 'i/i-map-point.svg',
            size: [196, 196],
            offset: [-98, -98]
          }],
          clusterIconContentLayout: MyIconContentLayout
        });

        var geoObjects = [];

        $.each(points, function (id, value) {
          geoObjects.push(value.placemark);
        });

        clusterer.add(geoObjects);
        myMap.geoObjects.add(clusterer);
        myMap.setBounds(clusterer.getBounds(), {checkZoomRange: true});
      }
    );

  });

});