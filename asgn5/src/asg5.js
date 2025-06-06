import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

function resizeRendererToDisplaySize( renderer ) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if ( needResize ) {
    renderer.setSize( width, height, false );
  }

  return needResize;
}

function loadColorTexture( loader, path ) {
  const texture = loader.load( path );
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({antialias: true, canvas});

  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set( 0, 10, 20 );

  const controls = new OrbitControls( camera, canvas );
  controls.target.set( 0, 5, 0 );
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color( 'black' );

  function updateCamera() {
    camera.updateProjectionMatrix();
  }
  
  const gui = new GUI();
  gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
  gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
  gui.add(minMaxGUIHelper, 'max', 0.1, 100, 0.1).name('far').onChange(updateCamera);

  const skyColor = 0xAAE2F4;
  const groundColor = 0x9d7961;
  const hemisphereIntensity = 1;
  const hemisphereLight = new THREE.HemisphereLight( skyColor, groundColor, hemisphereIntensity);
  scene.add( hemisphereLight );

  const sunColor = 0xEF8728;
  const directionalIntensity = 5;
  const directionalLight = new THREE.DirectionalLight(sunColor, directionalIntensity);
  directionalLight.position.set(10, 20, 0);
  scene.add(directionalLight);
 
  let objects = {};
  const loadManager = new THREE.LoadingManager();
  const loader = new THREE.TextureLoader( loadManager );

  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const skyBox = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  skyBox.scale(-1, 1, 1);
  
  const material1 = new THREE.MeshBasicMaterial({map: loadColorTexture(loader, '../lib/sky.jpg')});

  const coneRadius = 0.5;
  const coneHeight = 1;
  const coneSegments = 8;
  const cone = new THREE.ConeGeometry(coneRadius, coneHeight, coneSegments);
  const material2 = new THREE.MeshPhongMaterial({color: 0x9d7961});

  const sphereRadius = 0.5;
  const sphereWidthSegments = 32;
  const sphereHeightSegments = 16;
  const sphere = new THREE.SphereGeometry(sphereRadius, sphereWidthSegments, sphereHeightSegments);
  const material3 = new THREE.MeshBasicMaterial({map: loadColorTexture(loader, '../lib/sun.jpg')});

  const starRadius = 0.5;
  const starDetail = 0;
  const star = new THREE.OctahedronGeometry(starRadius, starDetail);
  
  function makeInstance( geometry, color ) {
    const material = new THREE.MeshPhongMaterial( { color } );

    const instance = new THREE.Mesh( geometry, material );
    scene.add( instance );

    instance.position.set(Math.random()*25-12.5, Math.random()*25, Math.random()*25-12.5); 
    
    const light = new THREE.PointLight( 0x8844aa, 100, 10 );
    light.position.set(instance.position.x, instance.position.y, instance.position.z);
    scene.add(light);

    return instance
  }

  const stars = [];
  for (let i = 0; i < 20; i++) {
    stars.push(makeInstance( star, 0x8844aa ));
  }

  const mtlLoader = new MTLLoader( loadManager );
  mtlLoader.load('../lib/windmill_001.mtl', (mtl) => {
    mtl.preload();
    const objLoader = new OBJLoader( loadManager );
    objLoader.setMaterials(mtl);
    objLoader.load('../lib/windmill_001.obj', (root) => {
      scene.add(root);
    });
  });


  const loadingElem = document.querySelector('#loading');
  const progressBarElem = loadingElem.querySelector('.progressbar');

  loadManager.onLoad = () => {
    loadingElem.style.display = 'none';
 
    const sky = new THREE.Mesh(skyBox, material1);
    sky.scale.set(50, 50, 50);
    scene.add(sky);
    objects = {...objects, sky};

    const island = new THREE.Mesh(cone, material2);
    island.scale.set(25, -5, 25);
    island.position.y -= 2.5;
    scene.add(island);
    objects = {...objects, island};

    const sun = new THREE.Mesh(sphere, material3);
    sun.scale.set(5, 5, 5);
    sun.position.set(10, 20, 0);
    scene.add(sun);
    objects = {...objects, sun};
  
    requestAnimationFrame(render);
  };
  
  loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
    const progress = itemsLoaded / itemsTotal;
    progressBarElem.style.transform = `scaleX(${progress})`;
  };

  function render(time) {
    time *= 0.001;

    if ( resizeRendererToDisplaySize( renderer ) ) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    objects.sun.position.x = Math.cos(time)*10;
    objects.sun.position.z = Math.sin(time)*10;
    directionalLight.position.x = Math.cos(time)*10;
    directionalLight.position.z = Math.sin(time)*10;
    stars.forEach((star, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      star.rotation.y = rot;
    });

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
}

main();
