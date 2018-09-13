var camera, scene, renderer, dirLight, hemiLight;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var container = $('.js-3d-model');
var url3d = container.attr('data-url');


init();
animate();


function init() {

  camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.z = 300;

  // scene

  scene = new THREE.Scene();

  scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
  scene.fog.color.setHSL( 0.6, 0, 1 );

  // LIGHTS

  hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.9 );
  hemiLight.color.setHSL( 0.6, 0.1, 0.9 );
  hemiLight.groundColor.setHSL( 0.095, 0.1, 0.9 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );

  //

  dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
  dirLight.color.setHSL( 0.1, 0.1, 0.2 );
  dirLight.position.set( -1, 1.75, 1 );
  dirLight.position.multiplyScalar( 50 );
  scene.add( dirLight );

  dirLight.castShadow = true;

  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;

  var d = 50;

  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;

  dirLight.shadow.camera.far = 3500;
  dirLight.shadow.bias = -0.0001;



  // model

  var onProgress = function ( xhr ) {
    if ( xhr.lengthComputable ) {
      var percentComplete = xhr.loaded / xhr.total * 100;
      console.log( Math.round(percentComplete, 2) + '% downloaded' );
    }
  };

  var onError = function ( xhr ) { };

  THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.crossOrigin = true;
  mtlLoader.setPath( '/energogarant-lk/js/obj/' );
  mtlLoader.load( url3d+'.mtl', function( materials ) {

    materials.preload();

    var objLoader = new THREE.OBJLoader();
    objLoader.crossOrigin = true;
    objLoader.setMaterials( materials );
    objLoader.setPath( '/energogarant-lk/js/obj/' );
    objLoader.load( url3d+'.obj', function ( object ) {

      object.position.y = - 95;
      scene.add( object );

    }, onProgress, onError );

  });

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.append(renderer.domElement);

  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

  //

  window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

  windowHalfX = window.innerWidth / 2;
  windowHalfY = window.innerHeight / 2;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

  mouseX = ( event.clientX - windowHalfX ) / 2;
  mouseY = ( event.clientY - windowHalfY ) / 2;

}

//

function animate() {

  requestAnimationFrame( animate );
  render();

}

function render() {

  camera.position.x += ( mouseX - camera.position.x ) * .05;
  camera.position.y += ( - mouseY - camera.position.y ) * .05;

  camera.lookAt( scene.position );

  renderer.render( scene, camera );

}