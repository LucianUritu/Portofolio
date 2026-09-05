export class MacbookStage {
  constructor(stage) {
    this.stage = stage;
    this.image = stage.querySelector("#macbookImage");
    this.progress = 0;
    this.targetProgress = 0;
    this.pointer = { x: 0, y: 0 };
  }

  start() {
    window.addEventListener("pointermove", (event) => {
      this.pointer.x = event.clientX / window.innerWidth - 0.5;
      this.pointer.y = event.clientY / window.innerHeight - 0.5;
    });
    this.animate();
  }

  setScrollProgress(progress) {
    this.targetProgress = Math.max(0, Math.min(1, progress));
  }

  animate() {
    this.progress += (this.targetProgress - this.progress) * 0.08;
    const turn = -72 + this.progress * 164 + this.pointer.x * 8;
    const lift = Math.sin(this.progress * Math.PI) * -42;
    const tilt = 58 - this.progress * 18 + this.pointer.y * 4;
    const scale = 1.02 + Math.sin(this.progress * Math.PI) * 0.08;

    this.image.style.transform = `
      translate3d(0, ${lift}px, 0)
      rotateX(${tilt}deg)
      rotateY(${turn}deg)
      rotateZ(${-6 + this.progress * 10}deg)
      scale(${scale})
    `;

    requestAnimationFrame(() => this.animate());
  }
}
