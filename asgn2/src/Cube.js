class Cube {
  constructor() {
    this.type='Cube';
    this.vertices = null;
    this.vertexBuffer = null;
    this.color = [1.0, 1.0, 1.0, 1.0];

    this.matrix = new Matrix4();

    this.setVertices();
  }

  setVertices() {
    this.vertices = new Float32Array([
      0,0,0, 1,1,0, 1,0,0,
      0,0,0, 0,1,0, 1,1,0,
      0,1,0, 0,1,1, 1,1,1,
      0,1,0, 1,1,1, 1,1,0,
      1,0,0, 1,1,1, 1,0,1,
      1,0,0, 1,1,0, 1,1,1,
      0,0,0, 0,1,1, 0,0,1,
      0,0,0, 0,1,0, 0,1,1,
      0,0,1, 1,1,1, 1,0,1,
      0,0,1, 0,1,1, 1,1,1,
      0,0,0, 0,0,1, 1,0,1,
      0,0,0, 1,0,1, 1,0,0
    ]);
  }

  render(gl) {
    var rgba = this.color;

    const a_Position = gl.getAttribLocation(gl.program, "a_Position");
    const u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    const u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
    
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

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
    gl.drawArrays(gl.TRIANGLES, 6, 6);
    
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
    gl.drawArrays(gl.TRIANGLES, 12, 6);
    
    gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
    gl.drawArrays(gl.TRIANGLES, 18, 6);
    
    gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
    gl.drawArrays(gl.TRIANGLES, 24, 6);

    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
    gl.drawArrays(gl.TRIANGLES, 30, 6);
  }

  drawCube(gl, M, color) {
    this.matrix = M;
    this.color = color;
    this.render(gl);
  }
}
