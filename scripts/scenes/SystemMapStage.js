export class SystemMapStage {
  constructor(stage) {
    this.stage = stage;
    this.map = stage.querySelector("#systemMap");
    this.canvas = stage.querySelector("#systemMapLines");
    this.context = this.canvas.getContext("2d");
    this.nodes = Array.from(stage.querySelectorAll(".map-node"));
    this.core = stage.querySelector(".map-core");
    this.progress = 0;
    this.targetProgress = 0;
    this.pointer = { x: 0, y: 0 };
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  }

  start() {
    this.resize();
    this.bind();
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

    [...this.nodes, this.core].forEach((node) => {
      node.addEventListener("click", () => {
        document.querySelector(node.dataset.target)?.scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  resize() {
    const bounds = this.stage.getBoundingClientRect();
    this.canvas.width = bounds.width * this.pixelRatio;
    this.canvas.height = bounds.height * this.pixelRatio;
    this.context.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
  }

  animate() {
    this.progress += (this.targetProgress - this.progress) * 0.08;
    const fadeStart = 0.7;
    const fade = this.progress <= fadeStart ? 1 : Math.max(0, 1 - (this.progress - fadeStart) / 0.18);
    const rotateY = this.pointer.x * 12 + this.progress * 34;
    const rotateX = -this.pointer.y * 10 - this.progress * 7;
    const scale = 1 + Math.sin(this.progress * Math.PI) * 0.08;

    this.stage.style.opacity = fade;
    this.map.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    this.drawLines();
    requestAnimationFrame(() => this.animate());
  }

  drawLines() {
    const bounds = this.stage.getBoundingClientRect();
    const coreBounds = this.core.getBoundingClientRect();
    const center = {
      x: coreBounds.left - bounds.left + coreBounds.width / 2,
      y: coreBounds.top - bounds.top + coreBounds.height / 2
    };

    this.context.clearRect(0, 0, bounds.width, bounds.height);
    this.context.lineWidth = 1.5;

    this.nodes.forEach((node, index) => {
      const nodeBounds = node.getBoundingClientRect();
      const end = {
        x: nodeBounds.left - bounds.left + nodeBounds.width / 2,
        y: nodeBounds.top - bounds.top + nodeBounds.height / 2
      };
      const pulse = 0.32 + Math.sin(performance.now() / 650 + index) * 0.18;
      this.context.strokeStyle = `rgba(36, 87, 255, ${pulse})`;
      this.context.beginPath();
      this.context.moveTo(center.x, center.y);
      this.context.lineTo(end.x, end.y);
      this.context.stroke();
    });
  }
}
