"use client"

import { motion, useInView, useReducedMotion } from "framer-motion"
import { useRef } from "react"

interface ScrollRevealProps {
    children: React.ReactNode
    className?: string
    delay?: number
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, margin: "-100px" })
    const shouldReduceMotion = useReducedMotion()

    const animateState = shouldReduceMotion
        ? { opacity: 1, y: 0 }
        : (isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 })

    const transitionState = {
        duration: shouldReduceMotion ? 0 : 0.8,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.21, 0.47, 0.32, 0.98] as any
    }

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            animate={animateState}
            transition={transitionState}
            className={className}
        >
            {children}
        </motion.div>
    )
}
