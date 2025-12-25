"use client"

import { motion } from "framer-motion"

export function Logo({ className }: { className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <motion.div
                className="relative w-8 h-8"
                initial="initial"
                whileHover="hover"
                animate="animate"
            >
                {/* Outer Box */}
                <motion.svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full text-primary"
                >
                    <motion.path
                        d="M16 2L2 9V23L16 30L30 23V9L16 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={{
                            initial: { pathLength: 1, opacity: 1 },
                            animate: {
                                pathLength: [0, 1],
                                opacity: [0, 1],
                                transition: { duration: 1.5, ease: "easeInOut" }
                            },
                            hover: { scale: 1.05, transition: { duration: 0.3 } }
                        }}
                    />

                    {/* Inner Structure - Top Face */}
                    <motion.path
                        d="M16 2L30 9L16 16L2 9L16 2Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={{
                            initial: { opacity: 0 },
                            animate: { opacity: 1, transition: { delay: 0.5, duration: 0.8 } },
                            hover: { y: -1, transition: { duration: 0.3 } }
                        }}
                    />

                    {/* Inner Structure - Vertical Line */}
                    <motion.path
                        d="M16 16V30"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        variants={{
                            initial: { pathLength: 0 },
                            animate: { pathLength: 1, transition: { delay: 1, duration: 0.8 } },
                            hover: { opacity: 0.8 }
                        }}
                    />

                    {/* Inner Cube - Abstract Representation of "Containment" */}
                    <motion.rect
                        x="12"
                        y="12"
                        width="8"
                        height="8"
                        rx="1"
                        fill="currentColor"
                        className="text-primary/20"
                        variants={{
                            initial: { scale: 0, opacity: 0 },
                            animate: { scale: 1, opacity: 1, transition: { delay: 1.5, duration: 0.5, type: "spring" } },
                            hover: { scale: 1.1, rotate: 90, transition: { duration: 0.5 } }
                        }}
                    />
                </motion.svg>
            </motion.div>
            <div>
                <span className="text-2xl font-bold tracking-tight text-foreground">PAPERBOX</span>
            </div>
        </div>
    )
}
