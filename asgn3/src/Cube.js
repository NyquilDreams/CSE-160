class Cube {
  constructor() {
    this.vertices = null;
    this.uvs = null;
    this.vertexBuffer = null;
    this.uvBuffer = null;
    this.color = [1.0, 1.0, 1.0, 1.0];

    this.matrix = new Matrix4();
    this.textureNum = 0;

    this.setVertices();
    this.setUvs();
  }

  setVertices() {
    this.vertices = new Float32Array([
      // FRONT
      0,0,0, 1,1,0, 1,0,0,
      0,0,0, 0,1,0, 1,1,0,
      // TOP
      0,1,0, 0,1,1, 1,1,1,
      0,1,0, 1,1,1, 1,1,0,
      // LEFT 
      1,0,0, 1,1,1, 1,0,1,
      1,0,0, 1,1,0, 1,1,1,
      // RIGHT
      0,0,0, 0,1,1, 0,0,1,
      0,0,0, 0,1,0, 0,1,1,
      // BACK
      0,0,1, 1,1,1, 1,0,1,
      0,0,1, 0,1,1, 1,1,1,
      // BOTTOM
      0,0,0, 0,0,1, 1,0,1,
      0,0,0, 1,0,1, 1,0,0
    ]);
  }

  setUvs() {
    this.uvs = new Float32Array([
      // FRONT
      0,0, 1,1, 1,0,
      0,0, 0,1, 1,1,
      // TOP
      0,1, 0,0, 1,0,
      0,1, 1,0, 1,1,
      // LEFT
      0,0, 1,1, 1,0,
      0,0, 0,1, 1,1,
      // RIGHT
      0,0, 1,1, 1,0,
      0,0, 0,1, 1,1,
      // BACK
      0,0, 1,1, 1,0,
      0,0, 0,1, 1,1,
      // BOTTOM
      0,1, 0,0, 1,0,
      0,1, 1,0, 1,1,
    ]);
  }

  render() {
    var rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textureNum);

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

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
  }

  drawCube(M, color) {
    this.matrix = M;
    this.color = color;
    this.render();
  }
}
