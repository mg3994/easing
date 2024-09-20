console.clear();

const π = Math.PI;
const PI2 = π * 2;
const { sin, asin, pow } = Math;

const DI = 800;
document.body.style.setProperty("--width", `${DI * 0.5}px`);

class Canvas {
  constructor(ease, ratio) {
    this.color = `hsl(${ratio * 360}deg, 100%, 70%)`;
    this.div = document.createElement("div");
    this.p = document.createElement("p");
    this.p.style.color = this.color;
    this.cvs = document.createElement("canvas");
    this.div.appendChild(this.cvs);
    this.div.appendChild(this.p);
    this.cvs.width = this.cvs.height = DI;
    this.inset = DI * 0.2;
    this.di = DI - this.inset * 2;
    this.ctx = this.cvs.getContext("2d");
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = this.color;
    this.ease = ease;
    this.reset();
  }

  reset() {
    this.y = 0;
    this.prevX = 0;
    this.ctx.clearRect(0, 0, DI, DI);
  }

  point(n) {
    return n * this.di + this.inset;
  }

  tick(x) {
    const newY = this.ease(x);

    this.ctx.beginPath();
    this.ctx.moveTo(this.point(this.prevX), this.point(0));
    this.ctx.lineTo(this.point(x), this.point(0));
    this.ctx.strokeStyle = "rgba(255,255,255,0.5)";
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(this.point(this.prevX), this.point(1 - this.y));
    this.ctx.lineTo(this.point(x), this.point(1 - newY));
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();

    this.p.innerHTML = `${funcToMath(
      this.ease.toString()
    )}<br />y = ${newY.toFixed(4)}`;

    this.y = newY;
    this.prevX = x;
  }
}

// this is literally all it takes to do easing. x = 0-1. the value returned is your y.
const ease = [
  (x) => x,
  (x) => pow(x, 3),
  (x) => (1 / π) * asin(2 * x - 1) + 0.5,
  (x) => pow(sin((π / 2) * x), 2),
  (x) => x * (2 - x),
  (x) => 1 - sin(π / (2 * (1 - x))) * pow(1 - x, 2)
];
const count = ease.length;
const canvases = ease.map((ease, i) => {
  const canvas = new Canvas(ease, i / count);
  document.querySelector("section").appendChild(canvas.div);
  return canvas;
});

run();

function run() {
  let x = 0;
  let dir = 1;
  const almost1 = 0.99999999999;

  const loop = () => {
    x = Math.min(almost1, x + 0.01);
    canvases.forEach((canvas) => canvas.tick(x));
    if (x >= almost1) {
      setTimeout(() => {
        canvases.forEach((canvas) => canvas.reset());
        loop();
      }, 500);
      x = 0;
    } else requestAnimationFrame(loop);
  };
  loop();
}

function funcToMath(string) {
  string = string.replace("x =>", "y =");
  string = string.replace(/pow\((.+\)), 2\)/g, "$1²");
  string = string.replace(/pow\(([^ ]+), 2\)/g, "$1²");
  string = string.replace(/pow\((.+), 2\)/g, "($1)²");
  string = string.replace(/pow\((.+\)), 3\)/g, "$1³");
  string = string.replace(/pow\(([^ ]+), 3\)/g, "$1³");
  string = string.replace(/pow\((.+), 3\)/g, "($1)³");
  return string;
}
