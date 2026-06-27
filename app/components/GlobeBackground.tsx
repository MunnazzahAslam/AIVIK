"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function GlobeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040c24, 0.025);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      1,
      500
    );
    camera.position.set(0, 10, 30);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Wave grid
    const waveGroup = new THREE.Group();
    scene.add(waveGroup);

    const geometry = new THREE.PlaneGeometry(150, 150, 80, 80);
    geometry.rotateX(-Math.PI / 2);

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x1e3678,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    waveGroup.add(new THREE.Mesh(geometry, wireframeMaterial));

    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x6378bd,
      size: 0.15,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    waveGroup.add(new THREE.Points(geometry, pointsMaterial));

    // Mouse parallax (X axis only)
    let mouseX = 0;
    const windowHalfX = window.innerWidth / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - windowHalfX) * 0.05;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        mouseX = (e.touches[0].pageX - windowHalfX) * 0.05;
      }
    };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onTouchMove);

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    const clock = new THREE.Clock();
    let rafId: number;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      const positions = geometry.attributes.position.array as Float32Array;

      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i];
        const z = positions[i + 2];
        positions[i + 1] =
          Math.sin(x * 0.1 + time * 1.5) * 1.2 +
          Math.sin(z * 0.1 + time * 1.2) * 1.2 +
          Math.sin((x + z) * 0.05 + time) * 0.5;
      }
      geometry.attributes.position.needsUpdate = true;

      camera.position.x += (mouseX - camera.position.x) * 0.02;
      camera.position.y = 10;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      wireframeMaterial.dispose();
      pointsMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
