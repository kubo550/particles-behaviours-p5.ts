import P5 from "p5";

export default class Particle {
  p5: P5;
  pos: P5.Vector;
  target: P5.Vector;
  vel: P5.Vector;
  acc: P5.Vector;
  size: number;
  maxSpeed: number;
  maxForce: number;
  hue: number;

  constructor(p5: P5, target: P5.Vector, hue: number) {
    this.p5 = p5;
    this.size = 2;
    this.pos = this.p5.createVector(
      this.p5.random(this.size, window.innerWidth - this.size),
      this.p5.random(this.size, window.innerHeight - this.size)
    );
    this.target = target.copy();
    this.vel = P5.Vector.random2D();
    this.acc = this.p5.createVector();
    this.maxSpeed = 5;
    this.maxForce = 1;
    this.hue = hue % 100;
  }

  draw() {
    const p5 = this.p5;
    p5.push();
    p5.colorMode(p5.HSL, 100);
    p5.noStroke();
    p5.fill(this.hue, 50, 50);
    p5.ellipse(this.pos.x, this.pos.y, this.size * 2);
    p5.pop();
  }

  behaviors(track: boolean = true) {
    if (!track) return;
    const seek = this.seek(this.target);
    this.applyForce(seek);
  }

  seek(target: P5.Vector) {
    const desired = P5.Vector.sub(target, this.pos);

    let speed = this.maxSpeed;
    const dist = desired.mag();
    if (dist < 100) {
      speed = this.p5.map(dist, 0, 100, 0, this.maxSpeed);
    }
    desired.setMag(speed);
    const steer = P5.Vector.sub(desired, this.vel);
    return steer;
  }

  strokeLine(particles: Particle[], d: boolean = false) {
    if (!d) return;
    const {
      p5,
      vel,
      pos: { x, y }
    } = this;
    if (p5.abs(vel.x) < 0.1 || p5.abs(vel.y) < 0.1) {
      this.vel = P5.Vector.random2D();
    }
    p5.push();
    p5.colorMode(p5.HSL);
    p5.stroke(this.hue, 40, 40, 90);
    particles.forEach((p) => {
      const dist = P5.Vector.dist(this.pos, p.pos);
      if (dist < 65 && dist > 55) {
        p5.line(x, y, p.pos.x, p.pos.y);
      }
    });
    p5.pop();
  }

  edges() {
    const {
      pos: { x, y },
      p5: { width, height },
      size
    } = this;
    if (x > width - size || x < size) {
      this.vel.x *= -1;
    }
    if (y > height - size || y < size) {
      this.vel.y *= -1;
    }
  }

  applyForce(force: P5.Vector) {
    this.acc.add(force);
  }

  update() {
    this.draw();
    this.edges();

    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }
}
