import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

const ThreeSceneWithControls = () => {
  const containerRef = useRef(null);
  const camera = useRef(null);
  const renderer = useRef(null);
  const scene = useRef(null);
  const controls = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    scene.current = new THREE.Scene();

    camera.current = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.current.position.set(0, 0, 10);

    renderer.current = new THREE.WebGLRenderer({ antialias: true });
    renderer.current.setSize(width, height);
    container.appendChild(renderer.current.domElement);

    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.current.add(cube);

    controls.current = new TrackballControls(camera.current, renderer.current.domElement);

    const handleResize = () => {
      const { clientWidth, clientHeight } = container;
      camera.current.aspect = clientWidth / clientHeight;
      camera.current.updateProjectionMatrix();
      renderer.current.setSize(clientWidth, clientHeight);
      controls.current.handleResize();
    };

    const animate = () => {
      requestAnimationFrame(animate);
      controls.current.update();
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.current.render(scene.current, camera.current);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      controls.current.dispose();
      renderer.current.dispose();
      container.removeChild(renderer.current.domElement);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
  );
};

export default ThreeSceneWithControls;
