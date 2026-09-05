import * as THREE from "three";

export class TechConstellation {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.group = new THREE.Group();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
  }

  start() {
    this.camera.position.set(0, 0, 8);
    this.scene.add(this.group);
    this.addLights();
    this.addCore();
    this.addOrbitingObjects();
    this.bind();
    this.resize();
    this.animate();
  }

  addLights() {
    this.scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const keyLight = new THREE.PointLight(0x42dcb7, 3.2, 20);
    keyLight.position.set(3, 4, 5);
    this.scene.add(keyLight);
    const rimLight = new THREE.PointLight(0xffc857, 2, 18);
    rimLight.position.set(-4, -2, 4);
    this.scene.add(rimLight);
  }

  addCore() {
    const geometry = new THREE.IcosahedronGeometry(1.35, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x101820,
      metalness: 0.62,
      roughness: 0.24,
      emissive: 0x12382f,
      emissiveIntensity: 0.38
    });
    this.core = new THREE.Mesh(geometry, material);
    this.group.add(this.core);

    const wire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.42, 1),
      new THREE.MeshBasicMaterial({ color: 0x42dcb7, wireframe: true, transparent: true, opacity: 0.42 })
    );
    this.group.add(wire);
  }

  addOrbitingObjects() {
    this.orbiters = [
      this.createOrbiter(new THREE.TorusKnotGeometry(0.28, 0.08, 80, 12), 0x42dcb7, 2.55, 0.5),
      this.createOrbiter(new THREE.BoxGeometry(0.5, 0.5, 0.5), 0xffc857, 3.2, 2.5),
      this.createOrbiter(new THREE.OctahedronGeometry(0.42), 0x6aa7ff, 2.9, 4.4),
      this.createOrbiter(new THREE.TetrahedronGeometry(0.5), 0xff6b8f, 3.55, 5.7)
    ];
    this.orbiters.forEach((orbiter) => this.group.add(orbiter.mesh));
  }

  createOrbiter(geometry, color, radius, phase) {
    const material = new THREE.MeshStandardMaterial({
      color,
      metalness: 0.45,
      roughness: 0.22,
      emissive: color,
      emissiveIntensity: 0.16
    });
    return { mesh: new THREE.Mesh(geometry, material), radius, phase };
  }

  bind() {
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("pointermove", (event) => {
      this.mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      this.mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
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
    this.group.rotation.y = elapsed * 0.22 + this.mouse.x * 0.16;
    this.group.rotation.x = Math.sin(elapsed * 0.32) * 0.15 - this.mouse.y * 0.08;
    this.core.rotation.x += 0.007;
    this.core.rotation.y += 0.01;

    this.orbiters.forEach((orbiter, index) => {
      const t = elapsed * (0.55 + index * 0.08) + orbiter.phase;
      orbiter.mesh.position.set(Math.cos(t) * orbiter.radius, Math.sin(t * 0.74) * 1.15, Math.sin(t) * orbiter.radius * 0.6);
      orbiter.mesh.rotation.x += 0.018;
      orbiter.mesh.rotation.y += 0.014;
    });

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }
}
