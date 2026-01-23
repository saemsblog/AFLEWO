"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textRef.current) {
            gsap.fromTo(
                textRef.current.children,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: "power4.out",
                    delay: 0.5,
                }
            );
        }
    }, []);

    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
            {/* Three.js 3D Background */}
            <div className="absolute inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                    <ambientLight intensity={1.5} />
                    <pointLight position={[10, 10, 10]} intensity={2} color="#FFD700" />
                    <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#10B981" />

                    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
                        <Sphere args={[1, 100, 200]} scale={2.5}>
                            <MeshDistortMaterial
                                color="#FFD700"
                                attach="material"
                                distort={0.4}
                                speed={1.5}
                                roughness={0.2}
                                metalness={0.8}
                            />
                        </Sphere>
                    </Float>

                    <OrbitControls enableZoom={false} enablePan={false} />
                </Canvas>
            </div>

            {/* Overlay Content */}
            <div className="relative z-10 text-center px-6 max-w-5xl" ref={textRef}>
                <h1 className="text-6xl md:text-8xl font-black text-gold mb-6 tracking-tight drop-shadow-2xl">
                    AFRICA LET'S WORSHIP
                </h1>
                <p className="text-xl md:text-3xl text-foreground/80 font-medium mb-10 leading-relaxed max-w-3xl mx-auto">
                    One God. One People. One Africa. <br />
                    Igniting a continent through the sound of heaven.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                    <button className="press-scale bg-gold text-brown px-10 py-4 rounded-ios font-bold text-lg shadow-glow hover:brightness-110 transition-all">
                        Experience the Archive
                    </button>
                    <button className="press-scale glass-card px-10 py-4 text-gold border-gold/30 font-bold text-lg hover:bg-gold/10 transition-all">
                        Join the Movement
                    </button>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
        </section>
    );
}
