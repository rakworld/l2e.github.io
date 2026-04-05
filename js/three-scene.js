import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const createPoints = (count, radius, color) => {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius + (Math.random() - 0.5) * 0.25;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color,
    size: 0.042,
    transparent: true,
    opacity: 0.95,
  });

  return new THREE.Points(geometry, material);
};

const buildHeroScene = (container) => {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
  const mouse = new THREE.Vector2();
  const group = new THREE.Group();
  const particlesGroup = new THREE.Group();

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  camera.position.set(0, 0.2, 6.2);

  const ambient = new THREE.AmbientLight(0x8ecbff, 0.95);
  const pointA = new THREE.PointLight(0x16b1ff, 5.2, 18);
  const pointB = new THREE.PointLight(0x1de980, 4.4, 16);
  pointA.position.set(3.2, 3.6, 3.8);
  pointB.position.set(-2.8, -2.2, 3.4);
  scene.add(ambient, pointA, pointB);

  const orb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.15, 18),
    new THREE.MeshPhysicalMaterial({
      color: 0x1aaeff,
      emissive: 0x0e7ae5,
      emissiveIntensity: 0.6,
      roughness: 0.16,
      metalness: 0.08,
      transmission: 0.18,
      transparent: true,
      opacity: 0.94,
      clearcoat: 0.9,
    })
  );

  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(1.7, 48, 48),
    new THREE.MeshBasicMaterial({
      color: 0x36e8a4,
      transparent: true,
      opacity: 0.09,
      wireframe: true,
    })
  );

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(1.36, 36, 36),
    new THREE.MeshBasicMaterial({
      color: 0x1de980,
      transparent: true,
      opacity: 0.08,
    })
  );

  const globe = createPoints(220, 2.45, 0x7ef7d3);
  const globeShell = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(2.24, 18, 18)),
    new THREE.LineBasicMaterial({ color: 0x1a8fff, transparent: true, opacity: 0.18 })
  );

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 500;
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i += 1) {
    starPositions[i * 3] = (Math.random() - 0.5) * 18;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 14;
  }

  starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(
    starGeometry,
    new THREE.PointsMaterial({
      color: 0x9bdcff,
      transparent: true,
      opacity: 0.38,
      size: 0.03,
    })
  );

  const nodeCount = 22;
  const nodeGeometry = new THREE.BufferGeometry();
  const nodePositions = new Float32Array(nodeCount * 3);
  const edgePositions = [];

  for (let i = 0; i < nodeCount; i += 1) {
    const x = (Math.random() - 0.5) * 5.4;
    const y = (Math.random() - 0.5) * 3.8;
    const z = (Math.random() - 0.5) * 2.6;
    nodePositions[i * 3] = x;
    nodePositions[i * 3 + 1] = y;
    nodePositions[i * 3 + 2] = z;

    if (i > 0) {
      const previousIndex = Math.max(0, i - 1 - Math.floor(Math.random() * Math.min(i, 3)));
      edgePositions.push(
        nodePositions[previousIndex * 3],
        nodePositions[previousIndex * 3 + 1],
        nodePositions[previousIndex * 3 + 2],
        x,
        y,
        z
      );
    }
  }

  nodeGeometry.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
  const nodes = new THREE.Points(
    nodeGeometry,
    new THREE.PointsMaterial({
      color: 0x16b1ff,
      size: 0.08,
      transparent: true,
      opacity: 0.95,
    })
  );

  const edgeGeometry = new THREE.BufferGeometry();
  edgeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(edgePositions, 3));
  const edges = new THREE.LineSegments(
    edgeGeometry,
    new THREE.LineBasicMaterial({ color: 0x34e7b4, transparent: true, opacity: 0.28 })
  );
  edges.position.set(0, -0.1, 0.6);
  nodes.position.copy(edges.position);

  particlesGroup.add(nodes, edges);
  group.add(orb, shell, glow, globe, globeShell);
  scene.add(group, particlesGroup, stars);

  const resize = () => {
    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth, clientHeight);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
  };

  const handlePointer = (event) => {
    const bounds = container.getBoundingClientRect();
    mouse.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    mouse.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
  };

  let rafId = 0;
  const render = () => {
    const time = performance.now() * 0.00045;
    group.rotation.y += 0.0038;
    globe.rotation.y -= 0.0018;
    shell.rotation.x += 0.0011;
    shell.rotation.z += 0.0014;
    particlesGroup.rotation.y -= 0.0024;
    particlesGroup.rotation.z = Math.sin(time) * 0.08;
    particlesGroup.position.y = Math.sin(time * 1.3) * 0.12;
    orb.position.y = Math.sin(time * 1.6) * 0.06;
    stars.rotation.y += 0.0004;

    if (!reducedMotion) {
      group.rotation.x += mouse.y * 0.0007;
      group.rotation.z += mouse.x * 0.0007;
      particlesGroup.position.x += mouse.x * 0.002;
      particlesGroup.position.y += mouse.y * 0.002;
    }

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(render);
  };

  window.addEventListener("resize", resize);
  container.addEventListener("pointermove", handlePointer);
  resize();
  render();

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
    container.removeEventListener("pointermove", handlePointer);
    renderer.dispose();
    container.querySelector("canvas")?.remove();
  };
};

document.addEventListener("DOMContentLoaded", () => {
  const stages = document.querySelectorAll("[data-three-scene]");
  stages.forEach((stage) => {
    buildHeroScene(stage);
  });
});
