import P5 from "p5";
import Particle from "./Particle";
import _font from "./Orbitron-Medium.ttf";

const sketch = (p5: P5) => {
  const particles: Particle[] = [];
  let font: P5.Font;
  let width: number, height: number;
  p5.preload = () => {
    font = p5.loadFont(_font);
  };

  p5.setup = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    p5.createCanvas(width, height);
    p5.textSize(84);
    const points = font.textToPoints("p5.ts", width * 0.1, height * 0.5, 250);
    p5.fill(0, 102, 153, 51);
    p5.textAlign(p5.CENTER);
    points.forEach((p, i) => {
      const target = p5.createVector(p.x, p.y);
      particles.push(new Particle(p5, target, i));
    });
  };

  p5.draw = () => {
    p5.background(41);
    if (!p5.mouseIsPressed) {
      p5.text("Press Mouse", width * 0.5, height * 0.9);
    }
    particles.forEach((particle, index) => {
      particle.update();
      particle.strokeLine(particles.slice(index), !p5.mouseIsPressed);
      particle.behaviors(p5.mouseIsPressed);
    });
  };
};

new P5(sketch);
