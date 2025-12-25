import { Section } from "@/components/ui/section"
import { Search, PenTool, Rocket, Settings, BarChart } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

const steps = [
    {
        title: "Assess",
        description: "We analyze your current infrastructure and identify gaps.",
        icon: Search,
    },
    {
        title: "Design",
        description: "We architect a scalable solution tailored to your needs.",
        icon: PenTool,
    },
    {
        title: "Deploy",
        description: "Seamless implementation with minimal disruption.",
        icon: Rocket,
    },
    {
        title: "Maintain",
        description: "Ongoing support and proactive monitoring.",
        icon: Settings,
    },
    {
        title: "Optimize",
        description: "Continuous improvement to drive efficiency.",
        icon: BarChart,
    },
]

export function Process() {
    return (
        <Section id="process" className="bg-muted/30">
            <ScrollReveal>
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Work</h2>
                    <p className="text-lg text-muted-foreground">
                        A streamlined, transparent process ensuring project success from day one.
                    </p>
                </div>
            </ScrollReveal>

            <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -translate-y-1/2 hidden md:block" />

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                    {steps.map((step, index) => (
                        <ScrollReveal key={step.title} delay={index * 0.15}>
                            <div className="flex flex-col items-center text-center group">
                                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center mb-6 group-hover:border-primary group-hover:scale-110 transition-all duration-300 shadow-sm">
                                    <step.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                                <p className="text-sm text-muted-foreground">{step.description}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </Section>
    )
}
