import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Simplified drone model using geometric shapes
function DroneMesh({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const droneRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (droneRef.current) {
      droneRef.current.rotation.y += 0.005;
      droneRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group
      ref={droneRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 0.4, 2]} />
        <meshStandardMaterial color={hovered ? '#0ea5e9' : '#1e293b'} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Center hub */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, 0.4, 32]} />
        <meshStandardMaterial color="#0ea5e9" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Arms */}
      {[[1.5, 0, 0], [-1.5, 0, 0], [0, 0, 1.5], [0, 0, -1.5]].map((pos, index) => (
        <group key={index} position={pos}>
          <mesh castShadow>
            <boxGeometry args={[0.8, 0.15, 0.15]} />
            <meshStandardMaterial color="#334155" metalness={0.7} roughness={0.3} />
          </mesh>
          
          {/* Propeller motor */}
          <mesh position={[0.5, 0.1, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>

          {/* Propeller */}
          <mesh position={[0.5, 0.25, 0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.8, 0.05, 0.05]} />
            <meshStandardMaterial color="#0ea5e9" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}

      {/* Camera/Gimbal */}
      <mesh position={[0, -0.3, 0.5]} castShadow>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[0, -0.3, 0.8]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.1, 16]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.5} />
      </mesh>

      {/* Landing gear */}
      {[[-0.8, -0.4, -0.8], [0.8, -0.4, -0.8], [-0.8, -0.4, 0.8], [0.8, -0.4, 0.8]].map((pos, index) => (
        <mesh key={index} position={pos} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export default function DroneModel() {
  return (
    <Canvas
      shadows
      camera={{ position: [8, 5, 8], fov: 50 }}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />
      
      <DroneMesh position={[0, 0, 0]} />
      
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={10}
        blur={2.5}
        far={4}
      />
      
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
      
      <Environment preset="city" />
    </Canvas>
  );
}