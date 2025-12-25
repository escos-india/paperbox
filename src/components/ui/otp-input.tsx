"use client"

import React, { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
    length?: number
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    autoFocus?: boolean
    className?: string
}

export function OTPInput({
    length = 6,
    value,
    onChange,
    disabled = false,
    autoFocus = true,
    className
}: OTPInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const [localValue, setLocalValue] = useState<string[]>(
        value.split('').concat(Array(length - value.length).fill(''))
    )

    useEffect(() => {
        const newValue = value.split('').concat(Array(length - value.length).fill(''))
        setLocalValue(newValue.slice(0, length))
    }, [value, length])

    useEffect(() => {
        if (autoFocus && inputRefs.current[0]) {
            inputRefs.current[0].focus()
        }
    }, [autoFocus])

    const focusInput = (index: number) => {
        if (index >= 0 && index < length && inputRefs.current[index]) {
            inputRefs.current[index]?.focus()
        }
    }

    const handleChange = (index: number, inputValue: string) => {
        if (disabled) return

        // Only allow single digit
        const digit = inputValue.slice(-1)
        if (digit && !/^\d$/.test(digit)) return

        const newValue = [...localValue]
        newValue[index] = digit
        setLocalValue(newValue)
        onChange(newValue.join(''))

        // Move to next input if digit entered
        if (digit && index < length - 1) {
            focusInput(index + 1)
        }
    }

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return

        switch (e.key) {
            case 'Backspace':
                e.preventDefault()
                const newValue = [...localValue]
                if (localValue[index]) {
                    // Clear current input
                    newValue[index] = ''
                    setLocalValue(newValue)
                    onChange(newValue.join(''))
                } else if (index > 0) {
                    // Move to previous input and clear it
                    newValue[index - 1] = ''
                    setLocalValue(newValue)
                    onChange(newValue.join(''))
                    focusInput(index - 1)
                }
                break
            case 'ArrowLeft':
                e.preventDefault()
                focusInput(index - 1)
                break
            case 'ArrowRight':
                e.preventDefault()
                focusInput(index + 1)
                break
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        if (disabled) return

        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)

        if (pastedData) {
            const newValue = pastedData.split('').concat(Array(length - pastedData.length).fill(''))
            setLocalValue(newValue)
            onChange(newValue.join(''))

            // Focus last input or next empty
            const nextIndex = Math.min(pastedData.length, length - 1)
            focusInput(nextIndex)
        }
    }

    const handleFocus = (index: number) => {
        inputRefs.current[index]?.select()
    }

    return (
        <div className={cn("flex gap-2 justify-center", className)}>
            {Array.from({ length }, (_, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={localValue[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={() => handleFocus(index)}
                    disabled={disabled}
                    className={cn(
                        "w-12 h-14 text-center text-2xl font-semibold",
                        "border-2 rounded-lg bg-background",
                        "focus:border-primary focus:ring-2 focus:ring-primary/20",
                        "transition-all duration-200",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        localValue[index] ? "border-primary" : "border-border"
                    )}
                    aria-label={`Digit ${index + 1}`}
                />
            ))}
        </div>
    )
}
