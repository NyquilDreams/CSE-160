class Triangle {
  constructor() {
    this.type='triangle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 10.0;
  }

  render() {
    var xy = this.position;
    var size = this.size;
    var rgba = this.color;
    var d = this.size/400.0;
    var vertices = [xy[0], xy[1]+d, xy[0]-d, xy[1]-d, xy[0]+d, xy[1]-d];

    gl.uniform1f(u_Size, size);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    drawTriangle(vertices);
  }
}

function drawTriangle(vertices) {
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      console.log('Failed to create the buffer object');
      return;
    }
    
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}
