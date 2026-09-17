"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Lightweight interactive wireframe globe. No external textures are fetched;
// everything is generated procedurally so it stays fast and works offline.
export default function EarthGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // Solid core sphere (very subtle, gives the wireframe some depth).
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(1.5, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x0a2620, transparent: true, opacity: 0.55 })
    );
    group.add(core);

    // Wireframe lattice.
    const wireGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(wireGeo),
      new THREE.LineBasicMaterial({ color: 0x4ade9a, transparent: true, opacity: 0.35 })
    );
    group.add(wireframe);

    // Scattered point cloud on the surface to suggest landmasses without a texture.
    const pointCount = 900;
    const positions = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i++) {
      // Bias sampling with simple noise bands so points cluster like coastlines.
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);
      const band = Math.sin(phi * 3 + theta * 2) * 0.5 + Math.sin(theta * 5) * 0.3;
      if (band < -0.15) continue;
      const r = 1.52;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(
      pointsGeo,
      new THREE.PointsMaterial({ color: 0x9ff5cf, size: 0.02, transparent: true, opacity: 0.9 })
    );
    group.add(points);

    // Faint outer glow ring.
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.62, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x2fbf85, transparent: true, opacity: 0.06 })
    );
    group.add(glow);

    // Drag-to-rotate + auto-spin with inertia.
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0.0018;
    let velY = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      velX = dx * 0.0025;
      velY = dy * 0.0025;
      group.rotation.y += velX;
      group.rotation.x += velY;
      lastX = e.clientX;
      lastY = e.clientY;
    };
    const onUp = () => {
      dragging = false;
    };

    renderer.domElement.style.cursor = "grab";
    renderer.domElement.addEventListener("pointerdown", (e) => {
      renderer.domElement.style.cursor = "grabbing";
      onDown(e);
    });
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", () => {
      renderer.domElement.style.cursor = "grab";
      onUp();
    });

    let frameId: number;
    const animate = () => {
      if (!dragging) {
        group.rotation.y += velX;
        group.rotation.x += velY;
        velX += (0.0018 - velX) * 0.02;
        velY += (0 - velY) * 0.02;
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-[420px] w-full touch-none select-none" />;
}
