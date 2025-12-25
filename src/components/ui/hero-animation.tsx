"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { PerspectiveCamera, Environment, ContactShadows, Edges, Text } from "@react-three/drei"
import * as THREE from "three"

// --- Constants ---
const ANIMATION_SPEED = 3

// --- Materials ---
const whiteMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.9,
    metalness: 0.05,
})

const deviceMaterial = new THREE.MeshStandardMaterial({
    color: "#1a1a1a", // Dark grey/black
    roughness: 0.7,
    metalness: 0.2,
})

const cableMaterial = new THREE.MeshStandardMaterial({
    color: "#3b82f6", // Blue
    roughness: 0.5,
    metalness: 0.1,
})

// --- Components ---

function PaperBox({ isOpen }: { isOpen: boolean }) {
    const flapFrontRef = useRef<THREE.Group>(null)
    const flapBackRef = useRef<THREE.Group>(null)
    const flapLeftRef = useRef<THREE.Group>(null)
    const flapRightRef = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        const speed = delta * ANIMATION_SPEED

        // --- Flap Rotation Logic ---
        // 0 = Vertical Up (Open)
        // PI/2 = Folded Inwards (Closed)

        // Open Angles (Slightly flared out)
        const openAngle = Math.PI / 3.5

        // Front (Pivot +Z): Close by rotating -X (-PI/2)
        const targetFront = isOpen ? openAngle : -Math.PI / 2
        if (flapFrontRef.current) flapFrontRef.current.rotation.x = THREE.MathUtils.lerp(flapFrontRef.current.rotation.x, targetFront, speed)

        // Back (Pivot -Z): Close by rotating +X (+PI/2)
        const targetBack = isOpen ? -openAngle : Math.PI / 2
        if (flapBackRef.current) flapBackRef.current.rotation.x = THREE.MathUtils.lerp(flapBackRef.current.rotation.x, targetBack, speed)

        // Left (Pivot -X): Close by rotating -Z (-PI/2) -> Open +Angle (Outwards)
        const targetLeft = isOpen ? openAngle : -Math.PI / 2
        if (flapLeftRef.current) flapLeftRef.current.rotation.z = THREE.MathUtils.lerp(flapLeftRef.current.rotation.z, targetLeft, speed)

        // Right (Pivot +X): Close by rotating +Z (+PI/2) -> Open -Angle (Outwards)
        const targetRight = isOpen ? -openAngle : Math.PI / 2
        if (flapRightRef.current) flapRightRef.current.rotation.z = THREE.MathUtils.lerp(flapRightRef.current.rotation.z, targetRight, speed)
    })

    const boxWidth = 2.0
    const boxHeight = 1.8
    const boxDepth = 1.6
    const wallThickness = 0.05

    // Flap Dimensions
    const flapFB_Length = boxDepth / 2
    const flapLR_Length = boxWidth / 2

    return (
        <group position={[0, -0.5, 0]}>
            {/* Box Body */}
            <group position={[0, boxHeight / 2, 0]}>
                {/* Bottom */}
                <mesh position={[0, -boxHeight / 2 + wallThickness / 2, 0]}>
                    <boxGeometry args={[boxWidth, wallThickness, boxDepth]} />
                    <primitive object={whiteMaterial} />
                    <Edges color="black" threshold={15} />
                </mesh>
                {/* Front Wall */}
                <mesh position={[0, 0, boxDepth / 2 - wallThickness / 2]}>
                    <boxGeometry args={[boxWidth, boxHeight, wallThickness]} />
                    <primitive object={whiteMaterial} />
                    <Edges color="black" threshold={15} />
                </mesh>
                {/* Back Wall */}
                <mesh position={[0, 0, -boxDepth / 2 + wallThickness / 2]}>
                    <boxGeometry args={[boxWidth, boxHeight, wallThickness]} />
                    <primitive object={whiteMaterial} />
                    <Edges color="black" threshold={15} />
                </mesh>
                {/* Left Wall */}
                <mesh position={[-boxWidth / 2 + wallThickness / 2, 0, 0]}>
                    <boxGeometry args={[wallThickness, boxHeight, boxDepth]} />
                    <primitive object={whiteMaterial} />
                    <Edges color="black" threshold={15} />
                </mesh>
                {/* Right Wall */}
                <mesh position={[boxWidth / 2 - wallThickness / 2, 0, 0]}>
                    <boxGeometry args={[wallThickness, boxHeight, boxDepth]} />
                    <primitive object={whiteMaterial} />
                    <Edges color="black" threshold={15} />
                </mesh>

                {/* Branding - Front Face */}
                <Text
                    position={[0, 0.2, boxDepth / 2 + 0.01]}
                    fontSize={0.35}
                    color="black"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight={800}
                    letterSpacing={-0.05}
                >
                    PAPERBOX
                </Text>
            </group>

            {/* Flaps */}

            {/* Left Flap (Bottom Layer) */}
            <group ref={flapLeftRef} position={[-boxWidth / 2 + wallThickness / 2, boxHeight, 0]}>
                <mesh position={[0, flapLR_Length / 2, 0]}>
                    <boxGeometry args={[wallThickness, flapLR_Length, boxDepth]} />
                    <primitive object={whiteMaterial} />
                    <Edges color="black" threshold={15} />
                </mesh>
            </group>

            {/* Right Flap (Bottom Layer) */}
            <group ref={flapRightRef} position={[boxWidth / 2 - wallThickness / 2, boxHeight, 0]}>
                <mesh position={[0, flapLR_Length / 2, 0]}>
                    <boxGeometry args={[wallThickness, flapLR_Length, boxDepth]} />
                    <primitive object={whiteMaterial} />
                    <Edges color="black" threshold={15} />
                </mesh>
            </group>

            {/* Front Flap (Top Layer - Pivot raised by thickness) */}
            <group ref={flapFrontRef} position={[0, boxHeight + wallThickness, boxDepth / 2 - wallThickness / 2]}>
                <mesh position={[0, flapFB_Length / 2, 0]}>
                    <boxGeometry args={[boxWidth, flapFB_Length, wallThickness]} />
                    <primitive object={whiteMaterial} />
                    <Edges color="black" threshold={15} />
                </mesh>
            </group>

            {/* Back Flap (Top Layer - Pivot raised by thickness) */}
            <group ref={flapBackRef} position={[0, boxHeight + wallThickness, -boxDepth / 2 + wallThickness / 2]}>
                <mesh position={[0, flapFB_Length / 2, 0]}>
                    <boxGeometry args={[boxWidth, flapFB_Length, wallThickness]} />
                    <primitive object={whiteMaterial} />
                    <Edges color="black" threshold={15} />
                </mesh>
            </group>
        </group>
    )
}

function Laptop({ isOpen }: { isOpen: boolean }) {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        if (!groupRef.current) return

        const targetPos = isOpen ? new THREE.Vector3(-2.0, -0.4, 0.8) : new THREE.Vector3(0, -0.4, 0)
        groupRef.current.position.lerp(targetPos, delta * ANIMATION_SPEED * 0.8)

        const targetScale = isOpen ? 1 : 0
        const currentScale = groupRef.current.scale.x
        const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * ANIMATION_SPEED)
        groupRef.current.scale.set(newScale, newScale, newScale)
    })

    return (
        <group ref={groupRef} rotation={[0, 0.3, 0]}>
            {/* Base */}
            <mesh position={[0, 0.02, 0]}>
                <boxGeometry args={[1.2, 0.04, 0.8]} />
                <primitive object={deviceMaterial} />
                <Edges color="#444" threshold={15} />
            </mesh>
            {/* Screen */}
            <mesh position={[0, 0.4, -0.4]} rotation={[-0.2, 0, 0]}>
                <boxGeometry args={[1.2, 0.8, 0.04]} />
                <primitive object={deviceMaterial} />
                <Edges color="#444" threshold={15} />
            </mesh>
            {/* Label (Floating) */}
            <Text position={[0, 0.9, -0.4]} fontSize={0.15} color="black" anchorX="center" anchorY="bottom">
                Laptop
            </Text>
        </group>
    )
}

function Server({ isOpen }: { isOpen: boolean }) {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        if (!groupRef.current) return

        const targetPos = isOpen ? new THREE.Vector3(2.5, -0.2, -0.5) : new THREE.Vector3(0, -0.4, 0)
        groupRef.current.position.lerp(targetPos, delta * ANIMATION_SPEED * 0.7)

        const targetScale = isOpen ? 1 : 0
        const currentScale = groupRef.current.scale.x
        const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * ANIMATION_SPEED)
        groupRef.current.scale.set(newScale, newScale, newScale)
    })

    return (
        <group ref={groupRef} rotation={[0, -0.2, 0]}>
            {/* Chassis */}
            <mesh>
                <boxGeometry args={[1.8, 0.2, 1.2]} />
                <primitive object={deviceMaterial} />
                <Edges color="#444" threshold={15} />
            </mesh>
            {/* Label (Floating) */}
            <Text position={[0, 0.5, 0]} fontSize={0.15} color="black" anchorX="center" anchorY="bottom">
                Server
            </Text>
        </group>
    )
}

function Firewall({ isOpen }: { isOpen: boolean }) {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        if (!groupRef.current) return

        const targetPos = isOpen ? new THREE.Vector3(2.2, -0.4, 1.2) : new THREE.Vector3(0, -0.4, 0)
        groupRef.current.position.lerp(targetPos, delta * ANIMATION_SPEED * 0.6)

        const targetScale = isOpen ? 1 : 0
        const currentScale = groupRef.current.scale.x
        const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * ANIMATION_SPEED)
        groupRef.current.scale.set(newScale, newScale, newScale)
    })

    return (
        <group ref={groupRef} rotation={[0, -0.1, 0]}>
            {/* Appliance */}
            <mesh>
                <boxGeometry args={[1.0, 0.15, 0.8]} />
                <primitive object={deviceMaterial} />
                <Edges color="#444" threshold={15} />
            </mesh>
            {/* Label (Floating) */}
            <Text position={[0, 0.5, 0]} fontSize={0.15} color="black" anchorX="center" anchorY="bottom">
                Firewall
            </Text>
        </group>
    )
}

function Cables({ isOpen }: { isOpen: boolean }) {
    const groupRef = useRef<THREE.Group>(null)

    useFrame((state, delta) => {
        if (!groupRef.current) return

        // Target: Move out to the front-right
        const targetPos = isOpen ? new THREE.Vector3(0.5, -0.5, 1.4) : new THREE.Vector3(0, -0.5, 0)
        groupRef.current.position.lerp(targetPos, delta * ANIMATION_SPEED * 0.5)

        const targetScale = isOpen ? 1 : 0
        const currentScale = groupRef.current.scale.x
        const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * ANIMATION_SPEED)
        groupRef.current.scale.set(newScale, newScale, newScale)
    })

    return (
        <group ref={groupRef} rotation={[0, 0.2, 0]}>
            {[...Array(3)].map((_, i) => (
                <group key={i} position={[i * 0.15 - 0.15, 0, 0]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
                        <primitive object={cableMaterial} />
                    </mesh>
                    <mesh position={[0, 0, 0.8]}>
                        <boxGeometry args={[0.06, 0.06, 0.12]} />
                        <meshStandardMaterial color="#555" />
                    </mesh>
                </group>
            ))}
        </group>
    )
}

function SceneContent({ isHovered }: { isHovered: boolean }) {
    return (
        <>
            <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
            <directionalLight position={[-5, 3, 2]} intensity={0.5} />
            <ambientLight intensity={0.8} />

            <group position={[0, -1, 0]} scale={0.85}>
                <PaperBox isOpen={isHovered} />
                <Laptop isOpen={isHovered} />
                <Server isOpen={isHovered} />
                <Firewall isOpen={isHovered} />
                <Cables isOpen={isHovered} />
            </group>

            <ContactShadows resolution={1024} scale={30} blur={2} opacity={0.2} far={10} color="#000000" />
        </>
    )
}

export function HeroAnimation() {
    const [isHovered, setIsHovered] = useState(false)

    return (
        <div
            className="w-full h-full cursor-pointer"
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
        >
            <Canvas shadows dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 5, 11]} fov={35} onUpdate={c => c.lookAt(0, 0, 0)} />
                <SceneContent isHovered={isHovered} />
                <Environment preset="studio" />
            </Canvas>
        </div>
    )
}
