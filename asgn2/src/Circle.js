class Circle {
  constructor() {
    this.type='Circle';
    this.position = [0.0, 0.0, 0.0];
    this.color = [1.0, 1.0, 1.0, 1.0];
    this.size = 10.0;
    this.segments = 10;
  }

  render() {
    var xy = this.position;
    var size = this.size;
    var rgba = this.color;
    var d = this.size/200.0;

    gl.uniform1f(u_Size, size);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    let angleStep = 360/this.segments;
    for (var angle = 0; angle < 360; angle += angleStep) {
      let angle2 = angle+angleStep;
      let vec1 = [Math.cos(angle*Math.PI/180)*d, Math.sin(angle*Math.PI/180)*d];
      let vec2 = [Math.cos(angle2*Math.PI/180)*d, Math.sin(angle2*Math.PI/180)*d];
      let pt1 = [xy[0]+vec1[0], xy[1]+vec1[1]];
      let pt2 = [xy[0]+vec2[0], xy[1]+vec2[1]];
    
      drawTriangle([xy[0], xy[1], pt1[0], pt1[1], pt2[0], pt2[1]]);
    }
  }
}
