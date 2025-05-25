function sin(x) {
  return Math.sin(x);
}

function cos(x) {
  return Math.cos(x);
}

class Sphere {
  constructor() {
    this.vertices = null;
    this.uvs = null;
    this.normals = null;
    this.vertexBuffer = null;
    this.uvBuffer = null;
    this.normalBuffer = null;
    this.color = [1.0, 1.0, 1.0, 1.0];

    this.matrix = new Matrix4();
    this.textureNum = -1;

    this.init();
  }

  init() {
    let v = [];
    let uv = [];
    let d = Math.PI/10;
    let dd = Math.PI/10;
    for (let t = 0; t < Math.PI; t += d) {
      for (let r = 0; r < (2*Math.PI); r += d) {
        let p1 = [sin(t)*cos(r), sin(t)*sin(r), cos(t)];
        let p2 = [sin(t+dd)*cos(r), sin(t+dd)*sin(r), cos(t+dd)];
        let p3 = [sin(t)*cos(r+dd), sin(t)*sin(r+dd), cos(t)];
        let p4 = [sin(t+dd)*cos(r+dd), sin(t+dd)*sin(r+dd), cos(t+dd)];

        let uv1 = [t/Math.PI, r/(2*Math.PI)];
        let uv2 = [(t+dd)/Math.PI, r/(2*Math.PI)];
        let uv3 = [t/Math.PI, (r+dd)/(2*Math.PI)]
        let uv4 = [(t+dd)/Math.PI, (r+dd)/(2*Math.PI)];

        v = v.concat(p1); uv = uv.concat(uv1);
        v = v.concat(p2); uv = uv.concat(uv2);
        v = v.concat(p4); uv = uv.concat(uv4);

        v = v.concat(p1); uv = uv.concat(uv1);
        v = v.concat(p4); uv = uv.concat(uv4);
        v = v.concat(p3); uv = uv.concat(uv3);
      }
    }
    this.vertices = new Float32Array(v);
    this.uvs = new Float32Array(uv);
    this.normals = new Float32Array(v);
  }

  render() {
    var rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    if (this.vertexBuffer === null) {
      this.vertexBuffer = gl.createBuffer();
      if (!this.vertexBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    if (this.uvBuffer === null) {
      this.uvBuffer = gl.createBuffer();
      if (!this.uvBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
      }
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_UV, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_UV);

    if (this.normalBuffer === null) {
      this.normalBuffer = gl.createBuffer();
      if (!this.normalBuffer) {
        console.log("Failed to create the buffer object");
        return -1;
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Normal);

    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length/3);
  }

  drawSphere(M, color) {
    this.matrix = M;
    this.color = color;
    this.render();
  }
}
