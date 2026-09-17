"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// Realistic, interactive Earth: actual country/ocean detail via NASA-derived
// imagery (three.js's standard example textures), plus a thin cloud layer and
// a soft atmosphere glow. Drag to rotate (with inertia); it auto-spins slowly
// when left alone.
const TEXTURE_BASE = "https://threejs.org/examples/textures/planets/";

export default function EarthGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(4, 2, 5);
    scene.add(sun);

    const group = new THREE.Group();
    scene.add(group);

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    const earthGeo = new THREE.SphereGeometry(1.5, 64, 64);
    const earthMat = new THREE.MeshPhongMaterial({
      map: loader.load(TEXTURE_BASE + "earth_atmos_2048.jpg"),
      specularMap: loader.load(TEXTURE_BASE + "earth_specular_2048.jpg"),
      normalMap: loader.load(TEXTURE_BASE + "earth_normal_2048.jpg"),
      normalScale: new THREE.Vector2(0.85, 0.85),
      specular: new THREE.Color(0x556655),
      shininess: 12,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    group.add(earth);

    const cloudsMat = new THREE.MeshLambertMaterial({
      map: loader.load(TEXTURE_BASE + "earth_clouds_1024.png"),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.516, 64, 64), cloudsMat);
    group.add(clouds);

    // Soft additive atmosphere glow (rendered back-face, no external shader needed).
    const glow = new THREE.Mesh(
      new THREE.SphereGeometry(1.62, 48, 48),
      new THREE.MeshBasicMaterial({
        color: 0x3fae7c,
        transparent: true,
        opacity: 0.18,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
      })
    );
    group.add(glow);

    group.rotation.z = (23.4 * Math.PI) / 180;
    group.rotation.y = 2.4;

    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0.0016;
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
      velY = dy * 0.0018;
      group.rotation.y += velX;
      group.rotation.x = Math.max(-1, Math.min(1, group.rotation.x + velY));
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
      clouds.rotation.y += 0.0007;
      if (!dragging) {
        group.rotation.y += velX;
        group.rotation.x += velY;
        velX += (0.0016 - velX) * 0.02;
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
      earthGeo.dispose();
      earthMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-[420px] w-full touch-none select-none" />;
}
