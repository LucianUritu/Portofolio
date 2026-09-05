export class BackgroundField {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  }

  start() {
    this.resize();
    this.seed();
    window.addEventListener("resize", () => {
      this.resize();
      this.seed();
    });
    window.addEventListener("pointermove", (event) => {
      this.mouse.x = event.clientX;
      this.mouse.y = event.clientY;
    });
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
  }

  seed() {
    const count = Math.round(Math.min(96, Math.max(42, window.innerWidth / 18)));
    this.particles = Array.from({ length: count }, () => ({
      x: Math.random() * this.width,
      y: Math.random() * this.height,
      radius: 1 + Math.random() * 2,
      vx: -0.22 + Math.random() * 0.44,
      vy: -0.18 + Math.random() * 0.36
    }));
  }

  animate() {
    this.context.clearRect(0, 0, this.width, this.height);
    this.drawParticles();
    requestAnimationFrame(() => this.animate());
  }

  drawParticles() {
    this.context.fillStyle = "rgba(238, 248, 255, 0.58)";
    this.context.strokeStyle = "rgba(66, 220, 183, 0.12)";

    this.particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;

      this.context.beginPath();
      this.context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.context.fill();

      for (let next = index + 1; next < this.particles.length; next += 1) {
        const other = this.particles[next];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (distance > 110) continue;
        this.context.globalAlpha = 1 - distance / 110;
        this.context.beginPath();
        this.context.moveTo(particle.x, particle.y);
        this.context.lineTo(other.x, other.y);
        this.context.stroke();
        this.context.globalAlpha = 1;
      }
    });
  }
}
