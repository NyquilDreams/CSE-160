class Drawing{
  render() {
    gl.uniform4f(u_FragColor, 0, 0.75, 0.17, 1);
    drawTriangle([-0.4, 1, -0.4, 0.2, 0.4, 0.2]);
    drawTriangle([0.4, 1, -0.4, 1, 0.4, 0.2]);
    drawTriangle([-0.3, 0.2, -0.3, -0.7, 0.3, -0.7]);
    drawTriangle([0.3, 0.2, -0.3, 0.2, 0.3, -0.7]);
    drawTriangle([-0.4, -0.7, -0.4, -1, -0.1, -1]);
    drawTriangle([-0.1, -0.7, -0.4, -0.7, -0.1, -1]);
    drawTriangle([0.1, -0.7, 0.1, -1, 0.4, -1]);
    drawTriangle([0.4, -0.7, 0.1, -0.7, 0.4, -1]);
    gl.uniform4f(u_FragColor, 0, 0, 0, 1);
    drawTriangle([-0.3, 0.8, -0.3, 0.6, -0.1, 0.6]);
    drawTriangle([-0.1, 0.8, -0.3, 0.8, -0.1, 0.6]);
    drawTriangle([0.1, 0.8, 0.1, 0.6, 0.3, 0.6]);
    drawTriangle([0.3, 0.8, 0.1, 0.8, 0.3, 0.6]);
    drawTriangle([-0.2, 0.5, -0.2, 0.3, -0.1, 0.3]);
    drawTriangle([-0.1, 0.5, -0.2, 0.5, -0.1, 0.3]);
    drawTriangle([0.1, 0.5, 0.1, 0.3, 0.2, 0.3]);
    drawTriangle([0.2, 0.5, 0.1, 0.5, 0.2, 0.3]);
    drawTriangle([-0.1, 0.6, -0.1, 0.4, 0.1, 0.4]);
    drawTriangle([0.1, 0.6, -0.1, 0.6, 0.1, 0.4]);
    gl.uniform4f(u_FragColor, 0, 0.23, 0.04, 1);
    drawTriangle([-0.4, -0.9, -0.4, -1, -0.1, -1]);
    drawTriangle([-0.1, -0.9, -0.4, -0.9, -0.1, -1]);
    drawTriangle([0.1, -0.9, 0.1, -1, 0.4, -1]);
    drawTriangle([0.4, -0.9, 0.1, -0.9, 0.4, -1]);
  }
}
