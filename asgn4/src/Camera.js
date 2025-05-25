class Camera {
  constructor() {
    this.eye = new Vector3([0, 1, 3]);
    this.at = new Vector3([0, 1, 0]);
    this.up = new Vector3([0, 1, 0]);
  }

  forward() {
    let d = new Vector3().set(this.at).sub(this.eye).normalize().mul(0.1);
    let x = this.eye.elements[0] + d.elements[0];
    let y = this.eye.elements[2] + d.elements[2];
    if (x > -4.9 && x < 4.9 && y > -4.9 && y < 4.9) {
      this.eye.add(d);
      this.at.add(d);
    }
  }

  left() {
    let d = new Vector3().set(this.at).sub(this.eye).normalize().mul(0.1);
    d = Vector3.cross(d, this.up);
    let x = this.eye.elements[0] - d.elements[0];
    let y = this.eye.elements[2] - d.elements[2];
    if (x > -4.9 && x < 4.9 && y > -4.9 && y < 4.9) {
      this.eye.sub(d);
      this.at.sub(d);
    }
  }

  backward() {
    let d = new Vector3().set(this.at).sub(this.eye).normalize().mul(0.1);
    let x = this.eye.elements[0] - d.elements[0];
    let y = this.eye.elements[2] - d.elements[2];
    if (x > -4.9 && x < 4.9 && y > -4.9 && y < 4.9) {
      this.eye.sub(d);
      this.at.sub(d);
    }
  }
  
  right() {
    let d = new Vector3().set(this.at).sub(this.eye).normalize().mul(0.1);
    d = Vector3.cross(d, this.up);
    let x = this.eye.elements[0] + d.elements[0];
    let y = this.eye.elements[2] + d.elements[2];
    if (x > -4.9 && x < 4.9 && y > -4.9 && y < 4.9) {
      this.eye.add(d);
      this.at.add(d);
    }
  }

  moveUp() {
    let d = new Vector3().set(this.up).normalize().mul(0.1);
    if (this.eye.elements[1] + d.elements[1] < 9.9) {
      this.eye.add(d);
      this.at.add(d);
    }
  }

  moveDown() {
    let d = new Vector3().set(this.up).normalize().mul(0.1);
    if (this.eye.elements[1] - d.elements[1] > 0.1) {
      this.eye.sub(d);
      this.at.sub(d);
    }
  }
  
  panLeft(angle=0.05) {
    let d = new Vector3().set(this.at).sub(this.eye);
    let r = Math.sqrt((d.elements[0] ** 2) + (d.elements[2] ** 2));
    let theta = Math.atan2(d.elements[2], d.elements[0]) - angle;
    d.elements[0] = Math.cos(theta) * r;
    d.elements[2] = Math.sin(theta) * r;
    this.at = d.add(this.eye);
  }

  panRight(angle=0.05) {
    let d = new Vector3().set(this.at).sub(this.eye);
    let r = Math.sqrt((d.elements[0] ** 2) + (d.elements[2] ** 2));
    let theta = Math.atan2(d.elements[2], d.elements[0]) + angle;
    d.elements[0] = Math.cos(theta) * r;
    d.elements[2] = Math.sin(theta) * r;
    this.at = d.add(this.eye);
  }
}
