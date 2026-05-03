import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Points, PointMaterial, Center, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ChatWidget from './ChatWidget';

// Procedural Trishul Component
const Trishul = () => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      // Slow rotation on Y axis
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Main Shaft */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 4, 32]} />
        <meshStandardMaterial color="#ff0000" metalness={0.8} roughness={0.2} emissive="#330000" />
      </mesh>

      {/* Middle Spike */}
      <mesh position={[0, 1.5, 0]}>
        <coneGeometry args={[0.08, 1, 32]} />
        <meshStandardMaterial color="#ff0000" metalness={0.9} roughness={0.1} emissive="#440000" />
      </mesh>

      {/* Outer Prongs (U-Shape curve approximation) */}
      <group position={[0, 1.2, 0]}>
        {/* Left Prong */}
        <mesh position={[-0.4, 0.2, 0]} rotation={[0, 0, Math.PI / 8]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 32]} />
          <meshStandardMaterial color="#ff0000" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[-0.6, 0.7, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.06, 0.6, 32]} />
          <meshStandardMaterial color="#ff0000" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Right Prong */}
        <mesh position={[0.4, 0.2, 0]} rotation={[0, 0, -Math.PI / 8]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 32]} />
          <meshStandardMaterial color="#ff0000" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.6, 0.7, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.06, 0.6, 32]} />
          <meshStandardMaterial color="#ff0000" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Connecting Bar */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 0.8, 32]} />
          <meshStandardMaterial color="#ff0000" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Small Damru detail */}
      <group position={[0, 0, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.2, 0.3, 32]} />
          <meshStandardMaterial color="#880000" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.2, 0.3, 32]} />
          <meshStandardMaterial color="#880000" metalness={0.5} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};

const ParticleField = () => {
  const count = 2000;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  const pointsRef = useRef();
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ff3333"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const RadialGlow = () => {
  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[10, 10]} />
      <meshBasicMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      >
        {/* Using a shader or a simple texture would be better, but let's use a basic emissive effect */}
        <canvasTexture
          attach="map"
          image={(() => {
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
            gradient.addColorStop(0, 'rgba(255, 10, 10, 0.5)');
            gradient.addColorStop(0.5, 'rgba(150, 0, 0, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 512, 512);
            return canvas;
          })()}
        />
      </meshBasicMaterial>
    </mesh>
  );
};

const HeroSection = () => {
  const containerRef = useRef();
  const subtitleRef = useRef();

  useGSAP(() => {
    // ── "DIVINE DIGITAL ARCHITECTURE" — letter-spacing reveal
    gsap.fromTo(
      subtitleRef.current,
      { opacity: 0, letterSpacing: "0.6em" },
      {
        opacity: 1,
        letterSpacing: "0.35em",
        duration: 1.2,
        ease: "power2.out",
        delay: 0.9,
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="home" className="relative w-full h-screen bg-black overflow-hidden">
      {/* 3D Scene — pointer-events: none so clicks pass through */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#ff0000" />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#ffffff" />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <Trishul />
          </Float>

          <ParticleField />
          <RadialGlow />
          
          <Sparkles count={50} scale={10} size={2} speed={0.5} color="#ff0000" />
        </Canvas>
      </div>

      {/* Text — sits in the lower third of the viewport */}
      <div
        className="absolute left-0 right-0 z-10 text-center pointer-events-none"
        style={{ top: "58%" }}
      >

        {/* "DIVINE DIGITAL ARCHITECTURE" — small caps subtitle */}
        <p
          ref={subtitleRef}
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "clamp(11px, 1.1vw, 15px)",
            fontWeight: 400,
            letterSpacing: "0.35em",
            color: "#cc3333",
            textTransform: "uppercase",
            marginTop: "16px",
            opacity: 0,
          }}
        >
          DIVINE DIGITAL ARCHITECTURE
        </p>
      </div>

      {/* Vignette Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,black_90%)]" />

      <ChatWidget />
    </section>
  );
};

export default HeroSection;
