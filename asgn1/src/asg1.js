var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    gl_PointSize = u_Size;
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
  
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (u_Size < 0) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor < 0) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedType = POINT;
function setType(type) {
  g_selectedType = type;
}
let g_selectedColor=[1.0, 1.0, 1.0, 1.0];
let g_selectedSize = 10.0;
let g_selectedSegments = 10;

function addActionsForHtmlUI() {
  document.getElementById('red').addEventListener('mouseup', function() { g_selectedColor[0] = this.value / 100; });
  document.getElementById('green').addEventListener('mouseup', function() { g_selectedColor[1] = this.value / 100; });
  document.getElementById('blue').addEventListener('mouseup', function() { g_selectedColor[2] = this.value / 100; });
  document.getElementById('alpha').addEventListener('mouseup', function() { g_selectedColor[3] = this.value / 100; });
  
  document.getElementById('size').addEventListener('mouseup', function() { g_selectedSize = Number(this.value); });
  document.getElementById('segment').addEventListener('mouseup', function() { g_selectedSegments = Number(this.value); });
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();

  addActionsForHtmlUI();

  canvas.onmousedown = click;
  canvas.onmousemove = function(ev) { if (ev.buttons==1) click(ev); };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapesList = [];
function clearCanvas() {
  g_shapesList = [];
  renderAllShapes();
}

function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);

  let shape;
  if (g_selectedType == POINT) {
    shape = new Point();
  } else if (g_selectedType == TRIANGLE) {
    shape = new Triangle();
  } else if (g_selectedType == CIRCLE) {
    shape = new Circle();
    shape.segments = g_selectedSegments;
  }
  shape.position = [x,y];
  shape.color = g_selectedColor.slice();
  shape.size = g_selectedSize;
  g_shapesList.push(shape);

  renderAllShapes();
}

function draw() {
  g_shapesList.push(new Drawing());
  renderAllShapes();
}

function convertCoordinatesEventToGL(ev) {
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2) / (canvas.width/2);
  y = (canvas.height/2 - (y - rect.top)) / (canvas.height/2);

  return([x, y]);
}

function renderAllShapes() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    g_shapesList[i].render();
  }
}

function left() {
  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    if (g_shapesList[i].position) g_shapesList[i].position[0] -= 0.1;
  }
  renderAllShapes();
}

function down() {
  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    if (g_shapesList[i].position) g_shapesList[i].position[1] -= 0.1;
  }
  renderAllShapes();
}

function up() {
  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    if (g_shapesList[i].position) g_shapesList[i].position[1] += 0.1;
  }
  renderAllShapes();
}

function right() {
  var len = g_shapesList.length;
  for (var i = 0; i < len; i++) {
    if (g_shapesList[i].position) g_shapesList[i].position[0] += 0.1;
  }
  renderAllShapes();
}

function download() {
  let url = canvas.toDataURL("image/jpg");
  const temp = document.createElement('a');
  temp.href = url;
  temp.download = "drawing";
  temp.click();
  temp.remove();
}
