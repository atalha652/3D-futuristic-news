import React from "react";
import { OrbitControls, Environment } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import envFile from "../assets/small_empty_room_2_4k.hdr";

export default function ThreeCanvas({ children }) {
  const camCanvasPos = [4, 5, 0];
  const directionLight = [3.3, 1.0, 4.4];

  return (
    <Canvas
      camera={{ position: camCanvasPos }}
      zoom
      style={{
        height: "100vh",
      }}
    >
      <gridHelper args={[20, 20, "white", "gray"]} />
      <axesHelper args={[2]} />
      <Environment files={envFile} background blur={0.1} />
      <directionalLight position={directionLight} />
      <OrbitControls target={[0, 1, 0]} />
      {children}
    </Canvas>
  );
}
