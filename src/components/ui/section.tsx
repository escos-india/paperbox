import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    container?: boolean
    containerClassName?: string
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
    ({ className, container = true, containerClassName, children, ...props }, ref) => {
        return (
            <section
                ref={ref}
                className={cn("py-16 md:py-24", className)}
                {...props}
            >
                {container ? (
                    <div className={cn("container mx-auto px-4 md:px-6", containerClassName)}>
                        {children}
                    </div>
                ) : (
                    children
                )}
            </section>
        )
    }
)
Section.displayName = "Section"

export { Section }
