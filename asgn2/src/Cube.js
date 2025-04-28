class Cube {
  constructor() {
    this.type='Cube';
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.matrix = new Matrix4();
  }

  render() {
    drawCube(this.matrix, this.color)
  }
}

function drawCube(M, color) {
    gl.uniformMatrix4fv(u_ModelMatrix, false, M.elements);

    var rgba = color;

    //front 
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
    drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);

    //top
    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);

    drawTriangle3D([0,1,0, 0,1,1, 1,1,1]);
    drawTriangle3D([0,1,0, 1,1,1, 1,1,0]);
    
    //right
    gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
  
    drawTriangle3D([1,0,0, 1,1,1, 1,0,1]);
    drawTriangle3D([1,0,0, 1,1,0, 1,1,1]);
  
    //left
    gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
    
    drawTriangle3D([0,0,0, 0,1,1, 0,0,1]);
    drawTriangle3D([0,0,0, 0,1,0, 0,1,1]);

    //back
    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
    
    drawTriangle3D([0,0,1, 1,1,1, 1,0,1]);
    drawTriangle3D([0,0,1, 0,1,1, 1,1,1]);
  
    //bottom
    gl.uniform4f(u_FragColor, rgba[0]*0.4, rgba[1]*0.4, rgba[2]*0.4, rgba[3]);
    
    drawTriangle3D([0,0,0, 0,0,1, 1,0,1]);
    drawTriangle3D([0,0,0, 1,0,1, 1,0,0]);
}
