"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function AnimatedBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY,
            })
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Grid Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
                }}
            />

            {/* Floating Nodes */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary rounded-full"
                    initial={{
                        x: Math.random() * 100 + "%",
                        y: Math.random() * 100 + "%",
                        opacity: Math.random() * 0.3 + 0.1,
                    }}
                    animate={{
                        y: [null, Math.random() * -100],
                        opacity: [null, 0],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}

            {/* Interactive Glow */}
            <motion.div
                className="absolute w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl"
                animate={{
                    x: mousePosition.x - 250,
                    y: mousePosition.y - 250,
                }}
                transition={{
                    type: "spring",
                    damping: 30,
                    stiffness: 200,
                    mass: 0.5,
                }}
            />
        </div>
    )
}
