var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotation;
  void main() {
    gl_Position = u_GlobalRotation * u_ModelMatrix * a_Position;
  }`

var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`

let canvas;
let gl;
let a_Position;
let u_Size;
let u_FragColor;

function setupWebGL() {
  canvas = document.getElementById('webgl');

  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  gl.enable(gl.DEPTH_TEST);
}

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
  
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor < 0) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix < 0) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotation = gl.getUniformLocation(gl.program, 'u_GlobalRotation');
  if (!u_GlobalRotation< 0) {
    console.log('Failed to get the storage location of u_GlobalRotation');
    return;
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_AnimalGlobalRotation = 0;
let g_legAngle = 0;
let g_footAngle = 0;
let g_toeAngle = 0;
let g_wingAngle = 0;

function addActionsForHtmlUI() {
  document.getElementById('angleSlide').addEventListener('input', function() { g_AnimalGlobalRotation = 360 * (this.value / 100); renderScene(); });
  document.getElementById('leg').addEventListener('input', function() { g_legAngle = this.value - 45; renderScene(); });
  document.getElementById('foot').addEventListener('input', function() { g_footAngle = this.value - 30; renderScene(); });
  document.getElementById('toe').addEventListener('input', function() { g_toeAngle = this.value - 30; renderScene(); });
  document.getElementById('wing').addEventListener('input', function() { g_wingAngle = this.value - 15; renderScene(); });
}

var g_special = false;
function main() {
  setupWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();
  
  canvas.onmousedown = function(ev) { 
    if (ev.shiftKey) {
      g_special = true;
      requestAnimationFrame(tick);
    }
  };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderScene();
}

var g_startTime = performance.now()/1000.0;
var g_seconds = 0;

function tick() {
  if (g_animation || g_special) {
    g_seconds = performance.now()/1000.0-g_startTime;

    renderScene();

    requestAnimationFrame(tick);
  }
}

var g_animation = false;
function toggleAnimation() {
  g_animation = !g_animation;
  requestAnimationFrame(tick);
}

var index = 0;
function renderScene() {
  var startTime = performance.now();

  var globalRotMat = new Matrix4().rotate(g_AnimalGlobalRotation, 0, 1, 0);
  if (g_special) {
    index++;
    globalRotMat.rotate(index, 0, 0, 1);
    if (index == 360) {
      index = 0;
      g_special = false;
    }
  }
  gl.uniformMatrix4fv(u_GlobalRotation, false, globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  var head = new Matrix4();
  head.scale(0.4, 0.4, 0.4);
  head.translate(-0.5, -0.5, 0, 0);
  drawCube(head, [0.5,1,0.5,1]);

  var leftEye = new Matrix4();
  leftEye.scale(0.25, 0.25, 0.25);
  leftEye.translate(0.1, 0, -0.2, 0);
  drawCube(leftEye, [1,0.0,0.0,1]);

  var rightEye = new Matrix4();
  rightEye.scale(0.25, 0.25, 0.25);
  rightEye.translate(-1.1, 0, -0.2, 0);
  drawCube(rightEye, [1,0.0,0.0,1]);

  var proboscis = new Matrix4();
  proboscis.scale(0.1, 0.1, 0.25);
  proboscis.translate(-0.5, -1.5, -1);
  drawCube(proboscis, [0.5,1,0.5,1]);

  var body = new Matrix4();
  body.scale(0.3, 0.3, 0.5);
  body.translate(-0.5, -1, 0.5);
  drawCube(body, [0.2,0.4,0.2,1]);

  var leg1 = new Matrix4();
  leg1.translate(0.15, -0.185, 0.25);
  leg1.rotate(240, 0, 0, 1);
  if (g_animation) {
    leg1.rotate(37.5 * Math.sin(g_seconds) - 7.5, 0, 0, 1);
  } else {
    leg1.rotate(g_legAngle, 0, 0, 1);
  }
  var foot1 = new Matrix4(leg1);
  leg1.scale(0.1, 0.15, 0.1);
  drawCube(leg1, [0.2,0.4,0.2,1]);

  foot1.rotate(-240, 0, 0, 1);
  foot1.rotate(g_footAngle, 0, 0, 1);
  foot1.translate(0.05, -0.225, 0);
  var toe1 = new Matrix4(foot1);
  foot1.scale(0.1, 0.15, 0.1);
  drawCube(foot1, [0.2,0.4,0.2,1]);

  toe1.rotate(-90, 0, 0, 1);
  toe1.rotate(g_toeAngle, 0, 0, 1);
  toe1.translate(-0.05, 0, 0);
  toe1.scale(0.05, 0.15, 0.1);
  drawCube(toe1, [0.2,0.4,0.2,1]);

  var leg2 = new Matrix4(leg1);
  leg2.translate(0, 0, 2);
  drawCube(leg2, [0.2,0.4,0.2,1]);
  var foot2 = new Matrix4(foot1);
  foot2.translate(0, 0, 2);
  drawCube(foot2, [0.2,0.4,0.2,1]);
  var toe2 = new Matrix4(toe1);
  toe2.translate(0, 0, 2);
  drawCube(toe2, [0.2,0.4,0.2,1]);

  var leg3 = new Matrix4(leg2);
  leg3.translate(0, 0, 2);
  drawCube(leg3, [0.2,0.4,0.2,1]);
  var foot3 = new Matrix4(foot2);
  foot3.translate(0, 0, 2);
  drawCube(foot3, [0.2,0.4,0.2,1]);
  var toe3 = new Matrix4(toe2);
  toe3.translate(0, 0, 2);
  drawCube(toe3, [0.2,0.4,0.2,1]);
  
  var leg4 = new Matrix4();
  leg4.translate(-0.15, -0.185, 0.25);
  leg4.rotate(120, 0, 0, 1);
  if (g_animation) {
    leg4.rotate(-(37.5 * Math.sin(g_seconds) - 7.5), 0, 0, 1);
  } else {
    leg4.rotate(-g_legAngle, 0, 0, 1);
  }
  var foot4 = new Matrix4(leg4);
  leg4.scale(-0.1, 0.15, 0.1);
  drawCube(leg4, [0.2,0.4,0.2,1]);

  foot4.rotate(-120, 0, 0, 1);
  foot4.rotate(-g_footAngle, 0, 0, 1);
  foot4.translate(-0.15, -0.225, 0);
  var toe4 = new Matrix4(foot4);
  foot4.scale(0.1, 0.15, 0.1);
  drawCube(foot4, [0.2,0.4,0.2,1]);
  
  toe4.rotate(90, 0, 0, 1);
  toe4.translate(0, -0.1, 0);
  toe4.rotate(-g_toeAngle, 0, 0, 1);
  toe4.scale(0.05, 0.15, 0.1);
  drawCube(toe4, [0.2,0.4,0.2,1]);

  var leg5 = new Matrix4(leg4);
  leg5.translate(0, 0, 2);
  drawCube(leg5, [0.2,0.4,0.2,1]);
  var foot5 = new Matrix4(foot4);
  foot5.translate(0, 0, 2);
  drawCube(foot5, [0.2,0.4,0.2,1]);
  var toe5 = new Matrix4(toe4);
  toe5.translate(0, 0, 2);
  drawCube(toe5, [0.2,0.4,0.2,1]);

  var leg6 = new Matrix4(leg5);
  leg6.translate(0, 0, 2);
  drawCube(leg6, [0.2,0.4,0.2,1]);
  var foot6 = new Matrix4(foot5);
  foot6.translate(0, 0, 2);
  drawCube(foot6, [0.2,0.4,0.2,1]);
  var toe6 = new Matrix4(toe5);
  toe6.translate(0, 0, 2);
  drawCube(toe6, [0.2,0.4,0.2,1]);

  var leftWing = new Matrix4();
  if (g_animation) {
    leftWing.rotate(-15 * Math.sin(g_seconds), 0, 0, 1);
  } else {
    leftWing.rotate(-g_wingAngle, 0, 0, 1);
  }
  leftWing.scale(0.25, 0.1, 0.35);
  leftWing.translate(0.6, -1, 1.15);
  drawCube(leftWing, [1,1,1,1]);
  
  var rightWing = new Matrix4();
  if (g_animation) {
    rightWing.rotate(15 * Math.sin(g_seconds), 0, 0, 1);
  } else {
    rightWing.rotate(g_wingAngle, 0, 0, 1);
  }
  rightWing.scale(0.25, 0.1, 0.35);
  rightWing.translate(-1.6, -1, 1.15);
  drawCube(rightWing, [1,1,1,1]);

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
