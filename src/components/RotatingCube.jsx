import React, { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars,Sphere } from "@react-three/drei";
import {  TextureLoader, CylinderGeometry, PlaneGeometry, MeshStandardMaterial, Mesh } from "three";
import { EffectComposer, Bloom, } from "@react-three/postprocessing";
import * as THREE from 'three';


const Sun = () => {
  const sunRef = useRef();
  return (
    <>

      <EffectComposer>
        <Bloom intensity={0.5} radius={0.5} threshold={0.1} />
      </EffectComposer>
      <mesh ref={sunRef}>
        {/* Sun Sphere */}
        <sphereGeometry args={[6, 35, 32]} />
        <meshStandardMaterial
          color="orange"
          emissive="orange"
          emissiveIntensity={1.5}
        />
        {/* Sunlight */}
        <pointLight
          color="yellow"
          intensity={2}
          distance={50}  // Controls the reach of light
          decay={2}      // Controls how the light fades over distance
          position={[0, 0, 0]} // Position of the sun
        />
      </mesh>
    </>
  );
};



// const Satellite = ({ distance, speed }) => {
//   const satelliteRef = useRef();

//   useFrame(({ clock }) => {
//     const t = clock.getElapsedTime() * speed;
//     satelliteRef.current.position.x = Math.cos(t) * distance;
//     satelliteRef.current.position.z = Math.sin(t) * distance;
//     satelliteRef.current.rotation.y += 0.05;
//   });

//   return (
//     <group ref={satelliteRef}>
//       {/* Satellite Body */}
//       <mesh>
//         <cylinderGeometry args={[0.2, 0.2, 0.5, 32]} />
//         <meshStandardMaterial color="silver" metalness={0.9} roughness={0.3} />
//       </mesh>
//       {/* Solar Panels */}
//       <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
//         <planeGeometry args={[1, 0.4]} />
//         <meshStandardMaterial color="blue" metalness={0.5} roughness={0.1} />
//       </mesh>
//       <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
//         <planeGeometry args={[1, 0.4]} />
//         <meshStandardMaterial color="blue" metalness={0.5} roughness={0.1} />
//       </mesh>
//     </group>
//   );
// };


const MilkyWayBackground = () => {
  const texture = useLoader(TextureLoader, "/textures/milkyway.jpg");
  return (
    <Sphere args={[500, 64, 64]} scale={[-1, 1, 1]}>
      <meshBasicMaterial map={texture} side={2} />
    </Sphere>
  );
};

const Moon = ({ distance, size, texturePath, speed, earthRef }) => {
  const moonRef = useRef();
  const moonTexture = useLoader(TextureLoader, texturePath);

  useFrame(({ clock }) => {
    if (!earthRef.current) return;
    const t = clock.getElapsedTime() * speed;
    moonRef.current.position.x = Math.cos(t) * distance;
    moonRef.current.position.z = Math.sin(t) * distance;
    moonRef.current.position.y = 0;
    moonRef.current.rotation.y += 0.02;
  });

  return (
    <mesh ref={moonRef}>
      <sphereGeometry args={[size, 10, 10]} />
      <meshStandardMaterial map={moonTexture} />
    </mesh>
  );
};


const Background = () => {
  const texture = useLoader(TextureLoader, "/textures/milkyway.jpg")
  return <primitive attach="background" object={texture} />;
};




const Earth = () => {
  const earthRef = useRef();
  const earthTexture = useLoader(TextureLoader, "/textures/earth.jpg");

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.5;
    earthRef.current.position.x = Math.cos(t) * 17;
    earthRef.current.position.z = Math.sin(t) * 17;
    earthRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={earthRef}>
      <mesh>
        <sphereGeometry args={[1.3, 32, 32]} />
        <meshStandardMaterial map={earthTexture} />
      </mesh>
      <Moon distance={1.9} size={0.3} texturePath="/textures/moon.jpg" speed={1.5} earthRef={earthRef} />
      {/* <Satellite distance={2.5} speed={1.2} />
      <Satellite distance={3} speed={0.8} /> */}
    </group>
  );
};

const AsteroidBelt = ({ count = 100 }) => {
  const asteroids = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.09; // Slow orbit movement
    asteroids.current.forEach((asteroid, i) => {
      if (asteroid) {
        const angle = (i / count) * Math.PI * 22 + t; // Circular motion
        // const randomOffset = (Math.random() - 0.5) * 10;
        const distance = 26 + (i % 9) * 0.4; // Keep asteroids evenly spread
        // asteroid.position.x = Math.cos(angle+randomOffset) * distance;
        // asteroid.position.z = Math.sin(angle+randomOffset) * distance;

        asteroid.position.x = Math.cos(angle) * distance;
        asteroid.position.z = Math.sin(angle) * distance;
      }
    });
  });

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (asteroids.current[i] = el)}
          position={[
            Math.cos((i ) * Math.PI * 2) * 22, // Initial X position
            0, // Fixed Y position (no up/down movement)
            Math.sin((i ) * Math.PI * 2) * 22, // Initial Z position
          ]}
        >
          <sphereGeometry args={[0.05, 6, 6]} /> {/* Smaller Asteroids */}
          <meshStandardMaterial color={"white"} />
        </mesh>
      ))}
    </group>
  );
};





const OrbitPath = ({ distance }) => {
  const points = [];
  for (let i = 0; i <= 100; i++) {
    const angle = (i / 100) * Math.PI * 2;
    points.push([Math.cos(angle) * distance, 0, Math.sin(angle) * distance]);
  }

  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array(points.flat())}
          itemSize={3}
          count={points.length}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="white" opacity={0.3} transparent />
    </line>
  );
};


const Planet = ({ distance, size, texturePath, speed, hasRing, ringTexturePath, moons = [] }) => {
  const planetRef = useRef();
  const planetTexture = useLoader(TextureLoader, texturePath);
  const ringTexture = hasRing ? useLoader(TextureLoader, ringTexturePath) : null;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;

    // Planet moves around the Sun
    planetRef.current.position.x = Math.cos(t) * distance;
    planetRef.current.position.z = Math.sin(t) * distance;

    // Rotation on Own Axis
    planetRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={planetRef}>
      {/* Main Planet */}
      <mesh>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={planetTexture} />
      </mesh>

      {/* Rings (if any) */}
      {hasRing && (
        <mesh rotation={[Math.PI / 3, 0.2, 0]}>
          <torusGeometry args={[size * 1.8, 0.2, 16, 100]} />
          <meshStandardMaterial map={ringTexture} transparent />
        </mesh>
      )}

      {/* Moons (if any) */}
    
    </group>
  );
};


const SolarSystem = () => {
  return (
    <Canvas style={{ background: "black" }} camera={{ position: [0, 20, 50] }}>
      <MilkyWayBackground/>

      <Stars radius={400} depth={100} count={6000} factor={10} fade />
      {/* <Background/> */}
      <OrbitControls enableZoom enablePan enableRotate />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <Sun />

      {/* Planets */}
      <OrbitPath distance={9} />
      <Planet distance={9} size={0.9} texturePath="/textures/mercury.jpg" speed={0.8} />

      <OrbitPath distance={13} />
      <Planet distance={13} size={1.2} texturePath="/textures/venus.jpg" speed={0.6} />

      <OrbitPath distance={17} />
      <Earth/>


      <OrbitPath distance={21} />
      <Planet distance={21} size={1.1} texturePath="/textures/mars.jpg" speed={0.4} />

      {/* Asteroid Belt */}
      <AsteroidBelt count={700} />

      <OrbitPath distance={32} />
      <Planet distance={32} size={2.9} texturePath="/textures/jupiter.jpg" speed={0.2} />

      <OrbitPath distance={39} />
      <Planet
        distance={39}
        size={2.4}
        texturePath="/textures/saturn.jpg"
        speed={0.15}
        hasRing={true}
        ringTexturePath="/textures/saturn_ring.png"
      />

      <OrbitPath distance={45} />
      <Planet distance={45} size={1.9} texturePath="/textures/uranus.jpg" speed={0.12} />

      <OrbitPath distance={49} />
      <Planet distance={49} size={1.8} texturePath="/textures/neptune.jpg" speed={0.1} />
    </Canvas>
  );
};


export default SolarSystem;
