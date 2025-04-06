function main() {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawVector(v, color) {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');

  ctx.beginPath();
  ctx.moveTo(canvas.width/2, canvas.height/2);
  ctx.lineTo((canvas.width/2) + (v.elements[0]*20), (canvas.height/2) - (v.elements[1]*20));
  ctx.strokeStyle = color;
  ctx.stroke();
}

function handleDrawEvent() {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');
  
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  var x1 = document.getElementById('x1');
  var y1 = document.getElementById('y1');
  var v1 = new Vector3([x1.value, y1.value, 0]);
  drawVector(v1, "red");

  var x2 = document.getElementById('x2');
  var y2 = document.getElementById('y2');
  var v2 = new Vector3([x2.value, y2.value, 0]);
  drawVector(v2, "blue");
}

function handleDrawOperationEvent() {
  var canvas = document.getElementById('example');
  var ctx = canvas.getContext('2d');
  
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  var x1 = document.getElementById('x1');
  var y1 = document.getElementById('y1');
  var v1 = new Vector3([x1.value, y1.value, 0]);
  drawVector(v1, "red");

  var x2 = document.getElementById('x2');
  var y2 = document.getElementById('y2');
  var v2 = new Vector3([x2.value, y2.value, 0]);
  drawVector(v2, "blue");
 
  var operation = document.getElementById('operation');
  if (operation.value == "Magnitude") {
    console.log("Magnitude v1: " + v1.magnitude());
    console.log("Magnitude v2: " + v2.magnitude());
  } else if (operation.value == "Angle between") {
    console.log("Angle: " + angleBetween(v1, v2));
  } else if (operation.value == "Area") {
    var v3 = Vector3.cross(v1, v2);
    console.log("Area of the triangle: " + (v3.magnitude() / 2));
  } else { 
    if (operation.value == "Add") {
      var v3 = v1.add(v2);
    } else if (operation.value == "Subtract") {
      var v3 = v1.sub(v2);
    } else {
      var scalar = document.getElementById('scalar');
      if (operation.value == "Multiply") {
        var v3 = v1.mul(scalar.value);
        var v4 = v2.mul(scalar.value);
      } else if (operation.value == "Divide") {
        var v3 = v1.div(scalar.value);
        var v4 = v2.div(scalar.value);
      } else if (operation.value == "Normalize") {
        var v3 = v1.normalize();
        var v4 = v2.normalize();
      }
      drawVector(v4, "green");
    }
    drawVector(v3, "green");
  }
}

function angleBetween(v1, v2) {
  var a = Vector3.dot(v1, v2);
  a /= v1.magnitude();
  a /= v2.magnitude();
  a = Math.acos(a);
  a *= 180;
  a /= Math.PI;
  return a;
}
