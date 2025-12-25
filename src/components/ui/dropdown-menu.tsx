"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    return (
        <div className="relative inline-block text-left" ref={containerRef}>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // @ts-ignore
                    return React.cloneElement(child, { open, setOpen })
                }
                return child
            })}
        </div>
    )
}

const DropdownMenuTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { open?: boolean, setOpen?: (v: boolean) => void }
>(({ className, children, open, setOpen, onClick, ...props }, ref) => (
    <button
        ref={ref}
        onClick={(e) => {
            onClick?.(e)
            setOpen?.(!open)
        }}
        className={cn("outline-none", className)}
        {...props}
    >
        {children}
    </button>
))
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { open?: boolean, setOpen?: (v: boolean) => void }
>(({ className, align = "center", open, setOpen, ...props }, ref) => {
    if (!open) return null
    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
                align === "end" ? "right-0" : "left-0",
                className
            )}
            {...props}
        />
    )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

const DropdownMenuItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { inset?: boolean }
>(({ className, inset, onClick, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer",
            inset && "pl-8",
            className
        )}
        onClick={onClick}
        {...props}
    />
))
DropdownMenuItem.displayName = "DropdownMenuItem"

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
}
