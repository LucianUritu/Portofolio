export class CommandCenter {
  constructor(root) {
    this.root = root;
    this.canvas = root.querySelector("#telemetryCanvas");
    this.context = this.canvas.getContext("2d");
    this.feed = root.querySelector("#terminalFeed");
    this.progress = 0;
    this.targetProgress = 0;
    this.pointer = { x: 0, y: 0 };
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.lines = [
      "boot lucian.profile",
      "load projects: open-science, hpc, networking, 3d-ux",
      "signal clean-architecture --priority high",
      "deploy curiosity --mode always-on"
    ];
  }

  start() {
    this.resize();
    this.bind();
    this.feed.textContent = this.lines.join("\n");
    this.animate();
  }

  setScrollProgress(progress) {
    this.targetProgress = Math.max(0, Math.min(1, progress));
  }

  bind() {
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("pointermove", (event) => {
      this.pointer.x = event.clientX / window.innerWidth - 0.5;
      this.pointer.y = event.clientY / window.innerHeight - 0.5;
    });
  }

  resize() {
    const bounds = this.canvas.getBoundingClientRect();
    this.canvas.width = bounds.width * this.pixelRatio;
    this.canvas.height = bounds.height * this.pixelRatio;
    this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
  }

  animate() {
    this.progress += (this.targetProgress - this.progress) * 0.08;
    const rotateX = -this.pointer.y * 4 - this.progress * 2;
    const rotateY = this.pointer.x * 5 + this.progress * 5;
    const lift = Math.min(this.progress * -80, -8);
    const fade = this.progress < 0.84 ? 1 : Math.max(0, 1 - (this.progress - 0.84) / 0.12);

    this.root.style.transform = `translateY(${lift}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    this.root.style.opacity = fade;
    this.drawRadar();
    requestAnimationFrame(() => this.animate());
  }

  drawRadar() {
    const { width, height } = this.canvas.getBoundingClientRect();
    const cx = width / 2;
    const cy = height / 2;
    const radius = Math.min(width, height) * 0.36;
    const time = performance.now() / 1000;

    this.context.clearRect(0, 0, width, height);
    this.context.strokeStyle = "rgba(88, 166, 255, 0.22)";
    this.context.lineWidth = 1;

    for (let ring = 1; ring <= 4; ring += 1) {
      this.context.beginPath();
      this.context.arc(cx, cy, (radius / 4) * ring, 0, Math.PI * 2);
      this.context.stroke();
    }

    for (let spoke = 0; spoke < 8; spoke += 1) {
      const angle = (Math.PI * 2 * spoke) / 8;
      this.context.beginPath();
      this.context.moveTo(cx, cy);
      this.context.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
      this.context.stroke();
    }

    const sweep = time * 1.3;
    const gradient = this.context.createRadialGradient(cx, cy, 0, cx, cy, radius);
    gradient.addColorStop(0, "rgba(53, 255, 196, 0.26)");
    gradient.addColorStop(1, "rgba(53, 255, 196, 0)");
    this.context.fillStyle = gradient;
    this.context.beginPath();
    this.context.moveTo(cx, cy);
    this.context.arc(cx, cy, radius, sweep, sweep + 0.72);
    this.context.closePath();
    this.context.fill();

    const points = [
      [0.2, -0.42, "#35ffc4"],
      [0.54, -0.06, "#58a6ff"],
      [-0.42, 0.24, "#ffcf5a"],
      [0.08, 0.5, "#ff6b8f"]
    ];

    points.forEach(([x, y, color], index) => {
      const pulse = 4 + Math.sin(time * 3 + index) * 2;
      this.context.fillStyle = color;
      this.context.beginPath();
      this.context.arc(cx + x * radius, cy + y * radius, pulse, 0, Math.PI * 2);
      this.context.fill();
    });
  }
}
