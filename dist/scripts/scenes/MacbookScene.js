import * as THREE from "three";

export class MacbookScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.clock = new THREE.Clock();
    this.laptop = new THREE.Group();
    this.screenGroup = new THREE.Group();
    this.progress = 0;
    this.targetProgress = 0;
    this.pointer = { x: 0, y: 0 };
  }

  start() {
    this.camera.position.set(0, 1.2, 8.3);
    this.scene.add(this.laptop);
    this.addLights();
    this.buildMacbook();
    this.bind();
    this.resize();
    this.animate();
  }

  setScrollProgress(progress) {
    this.targetProgress = Math.max(0, Math.min(1, progress));
  }

  addLights() {
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xd9e5ef, 2.4));
    const softbox = new THREE.DirectionalLight(0xffffff, 3.2);
    softbox.position.set(4, 6, 5);
    this.scene.add(softbox);
    const rim = new THREE.PointLight(0x7c3aed, 1.8, 18);
    rim.position.set(-3, 1, 4);
    this.scene.add(rim);
  }

  buildMacbook() {
    this.laptop.rotation.x = -0.16;
    this.laptop.rotation.y = -0.28;
    this.laptop.add(this.createBase(), this.createKeyboard(), this.createTrackpad());

    this.screenGroup.position.set(0, 0.42, -1.28);
    this.screenGroup.rotation.x = -1.12;
    this.screenGroup.add(this.createScreenShell(), this.createScreenSurface(), ...this.createScreenCards());
    this.laptop.add(this.screenGroup);
  }

  createBase() {
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(4.9, 0.16, 3.15),
      new THREE.MeshStandardMaterial({ color: 0xd7dbe0, metalness: 0.78, roughness: 0.28 })
    );
    base.position.y = -0.12;
    return base;
  }

  createKeyboard() {
    const group = new THREE.Group();
    const keyMaterial = new THREE.MeshStandardMaterial({ color: 0x15171a, metalness: 0.18, roughness: 0.55 });
    for (let row = 0; row < 5; row += 1) {
      for (let col = 0; col < 12; col += 1) {
        const key = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.025, 0.16), keyMaterial);
        key.position.set(-1.65 + col * 0.3, -0.015, -0.7 + row * 0.24);
        group.add(key);
      }
    }
    return group;
  }

  createTrackpad() {
    const pad = new THREE.Mesh(
      new THREE.BoxGeometry(1.35, 0.018, 0.72),
      new THREE.MeshStandardMaterial({ color: 0xc4c9cf, metalness: 0.45, roughness: 0.34 })
    );
    pad.position.set(0, 0.005, 0.86);
    return pad;
  }

  createScreenShell() {
    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(4.72, 2.86, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x20242b, metalness: 0.42, roughness: 0.24 })
    );
    shell.position.set(0, 1.42, 0);
    return shell;
  }

  createScreenSurface() {
    const surface = new THREE.Mesh(
      new THREE.PlaneGeometry(4.25, 2.38),
      new THREE.MeshStandardMaterial({
        color: 0xf9fbff,
        roughness: 0.3,
        emissive: 0xdbeafe,
        emissiveIntensity: 0.22
      })
    );
    surface.position.set(0, 1.42, 0.071);
    return surface;
  }

  createScreenCards() {
    const colors = [0x111827, 0x14b8a6, 0x6366f1, 0xf59e0b];
    return colors.map((color, index) => {
      const card = new THREE.Mesh(
        new THREE.BoxGeometry(index === 0 ? 1.45 : 0.82, 0.38, 0.045),
        new THREE.MeshStandardMaterial({ color, roughness: 0.4, emissive: color, emissiveIntensity: 0.05 })
      );
      card.position.set(-1.15 + index * 0.78, 1.55 - (index % 2) * 0.56, 0.105);
      card.userData.phase = index * 0.8;
      return card;
    });
  }

  bind() {
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("pointermove", (event) => {
      this.pointer.x = event.clientX / window.innerWidth - 0.5;
      this.pointer.y = event.clientY / window.innerHeight - 0.5;
    });
  }

  resize() {
    const bounds = this.canvas.parentElement.getBoundingClientRect();
    this.renderer.setSize(bounds.width, bounds.height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.camera.aspect = bounds.width / bounds.height;
    this.camera.updateProjectionMatrix();
  }

  animate() {
    const elapsed = this.clock.getElapsedTime();
    this.progress += (this.targetProgress - this.progress) * 0.075;

    this.laptop.rotation.y = -0.38 + this.progress * Math.PI * 1.55 + this.pointer.x * 0.14;
    this.laptop.rotation.x = -0.16 + Math.sin(this.progress * Math.PI) * 0.28 - this.pointer.y * 0.08;
    this.laptop.rotation.z = Math.sin(this.progress * Math.PI * 1.2) * 0.05;
    this.screenGroup.rotation.x = -1.12 + Math.min(this.progress * 0.52, 0.42);

    this.screenGroup.children.forEach((child) => {
      if (!child.userData.phase) return;
      child.position.y += Math.sin(elapsed * 1.5 + child.userData.phase) * 0.0018;
    });

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }
}
