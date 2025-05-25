var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ProjectionMatrix;
  uniform mat4 u_ViewMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`

var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_lightColor;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  uniform bool u_lightOn;
  void main() {
    if (u_whichTexture == -2) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0);
    } else if (u_whichTexture == -1) {
      gl_FragColor = u_FragColor; 
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV);
    }

    vec3 lightVector = u_lightPos-vec3(v_VertPos);
    float r = length(lightVector);
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);

    vec3 R = reflect(-L, N);

    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

    vec3 specular = pow(max(dot(E,R), 0.0),100.0) * u_lightColor;

    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3 * u_lightColor;
    if (u_lightOn) {
      gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
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
var u_lightPos;
var u_lightColor;
var u_lightOn;
var u_cameraPos;

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
  
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage location of a_Normal');
    return;
  }

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
  
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
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
  
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return false;
  }
  
  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor) {
    console.log('Failed to get the storage location of u_lightColor');
    return false;
  }
  
  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return false;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
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

var g_normalOn;
var g_lightPos = [0, 3, 0];
var g_lightCenter = [0, 0, 0];
var g_lightOn = true;
var g_lightColor = [1, 1, 1]

function addActionsForHtmlUI() {
  document.getElementById('on').onclick = function() {g_normalOn=true;};
  document.getElementById('off').onclick = function() {g_normalOn=false;};
  document.getElementById('x').addEventListener('mousemove', function(ev) {
    if(ev.buttons == 1) { g_lightCenter[0] = this.value/10; }
  });
  document.getElementById('y').addEventListener('mousemove', function(ev) {
    if(ev.buttons == 1) { g_lightPos[1] = this.value/10; }
  });
  document.getElementById('z').addEventListener('mousemove', function(ev) {
    if(ev.buttons == 1) { g_lightCenter[2] = this.value/10; }
  });
  document.getElementById('on2').onclick = function() {g_lightOn=true;};
  document.getElementById('off2').onclick = function() {g_lightOn=false;};
  document.getElementById('red').addEventListener('mousemove', function(ev) {
    if(ev.buttons == 1) { g_lightColor[0] = this.value/100; }
  });
  document.getElementById('green').addEventListener('mousemove', function(ev) {
    if(ev.buttons == 1) { g_lightColor[1] = this.value/100; }
  });
  document.getElementById('blue').addEventListener('mousemove', function(ev) {
    if(ev.buttons == 1) { g_lightColor[2] = this.value/100; }
  });
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();

  camera = new Camera();

  document.onkeydown = keydown;
  document.onkeyup = keyup;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  initTextures();
}

var counter = 0;
function tick() {
  if (counter == 2) {
    g_seconds = performance.now()/1000.0-g_startTime;
    g_lightPos[0] = g_lightCenter[0] + 2*Math.sin(g_seconds);
    g_lightPos[2] = g_lightCenter[2] + 2*Math.cos(g_seconds);
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

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);
  gl.uniform1i(u_lightOn, g_lightOn);

  gl.uniform3f(u_cameraPos, camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2]);

  const cube = new Cube();
  const sphere = new Sphere();

  let light = new Matrix4();
  light.translate(g_lightPos[0], g_lightPos[1]+0.05, g_lightPos[2]);
  light.scale(-0.1, -0.1, -0.1);
  cube.drawCube(light, [1,1,0,1]);

  /*
  var ground = new Matrix4();
  ground.scale(10, 0, 10);
  cube.drawCube(ground, [0.4,0.4,0.4,1]);
  */


  var sky = new Matrix4();
  sky.translate(0, -0.01, 0);
  sky.scale(-10, -10, -10);
  sky.translate(0, -1, 0);
  if (g_normalOn) cube.textureNum = -2;
  cube.drawCube(sky, [0.7,0.7,0.7,1]);

  let box = new Matrix4();
  box.translate(4, 0, -4); 
  if (g_normalOn) cube.textureNum = -2;
  cube.drawCube(box, [0,1,0,1]);

  let box2 = new Matrix4();
  box2.translate(-4, 0, -4); 
  if (g_normalOn) cube.textureNum = -2;
  cube.drawCube(box2, [0,0,1,1]);

  let ball = new Matrix4();
  ball.translate(0, 1, 0);
  if (g_normalOn) sphere.textureNum = -2;
  sphere.drawSphere(ball, [1, 0, 0, 1]);

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
