var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;
  
  attribute vec2 a_UV;
  
  varying vec2 v_UV;

  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
  
    v_UV = a_UV;
  }`

var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = u_FragColor; 
    } else if (u_whichTexture == -1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    }
  }`

let canvas;
var gl;

function setupWebGL() {
  canvas = document.getElementById('webgl');

  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

var a_Position;
var a_UV;
var u_FragColor;
var u_ProjectionMatrix;
var u_ViewMatrix;
var u_ModelMatrix;
var u_Sampler0;
var u_whichTexture;

function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }
  
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor < 0) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix < 0) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix < 0) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
  
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix < 0) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }
  
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }
  
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }
}

var g_Rotation = 0;

function initTextures() {
  var image = new Image();
  if (!image) {
    console.log('Failed to create the image object');
    return false;
  }
  image.onload = function(){
    sendImageToTEXTURE0(image);
    requestAnimationFrame(tick);
  };
  image.src = './sky.jpg';

  var image2 = new Image();
  if (!image2) {
    console.log('Failed to create the image object');
    return false;
  }
  image2.onload = function(){
    sendImageToTEXTURE1(image2);
    requestAnimationFrame(tick);
  };
  image2.src = './block.jpg';

  return true;
}

function sendImageToTEXTURE0(image) {
  let texture0 = gl.createTexture();
  if (!texture0) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture0);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler0, 0);

  counter++;
}

function sendImageToTEXTURE1(image) {
  let texture1 = gl.createTexture();
  if (!texture1) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
  gl.activeTexture(gl.TEXTURE1);
  gl.bindTexture(gl.TEXTURE_2D, texture1);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  gl.uniform1i(u_Sampler1, 1);

  counter++;
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();

  camera = new Camera();

  document.onkeydown = keydown;
  document.onkeyup = keyup;

  canvas.onmousedown = (e) => {
    let box = new Vector3().set(camera.at).elements;
    box[0] -= 0.5;
    box[1] -= 0.1;
    box[2] -= 0.5;
    g_map.push(box);
  };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  for (let i = 0; i < 64; i++) {
    g_map.push([Math.trunc(Math.random()*50-25), 0, Math.trunc(Math.random()*50-25)]);
  }

  initTextures();
}

var counter = 0;
function tick() {
  if (counter == 2) {
    renderScene();
    requestAnimationFrame(tick);
  }
}

let keysPressed = {};

function keydown(ev) {
  keysPressed[ev.key] = true;
  if (keysPressed['w']) {
    camera.forward();
  }
  if (keysPressed['a']) {
    camera.left();
  } 
  if (keysPressed['s']) {
    camera.backward();
  } 
  if (keysPressed['d']) {
    camera.right();
  } 
  if (keysPressed[' ']) {
    camera.moveUp();
  }
  if (keysPressed['x']) {
    camera.moveDown();
  }
  if (keysPressed['q']) {
    camera.panLeft();
  } 
  if (keysPressed['e']) {
    camera.panRight();
  }
}

function keyup(ev) {
  delete keysPressed[ev.key];
}

var g_startTime = performance.now()/1000.0;
var g_seconds = 0;

var camera;

var g_map = [];

function renderScene() {
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
  
  var viewMat = new Matrix4();
  viewMat.setLookAt(camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],
                    camera.at.elements[0], camera.at.elements[1], camera.at.elements[2],
                    camera.up.elements[0], camera.up.elements[1], camera.up.elements[2]);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const cube = new Cube();

  var sky = new Matrix4();
  sky.scale(50, 50, 50);
  sky.translate(-0.5, -0.01, -0.5);
  cube.textureNum = 0;
  cube.drawCube(sky, [1,1,1,1]);

  var ground = new Matrix4();
  ground.scale(50, 0, 50);
  ground.translate(-0.5, 0, -0.5);
  cube.textureNum = -2;
  cube.drawCube(ground, [0.45, 0.35, 0.15, 1]);

  cube.textureNum = -1;
  for (let i = 0; i < g_map.length; i++) {
    let box = new Matrix4();
    box.translate(g_map[i][0], g_map[i][1], g_map[i][2]);
    cube.drawCube(box, [1,1,1,1]);
  }

  var duration = performance.now() - startTime;
  sendTextToHTML("ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "performance");
}

function sendTextToHTML(text, htmlID) {
  var htmlElem = document.getElementById(htmlID);
  if(!htmlElem) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElem.innerHTML = text;
}
