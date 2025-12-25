import { Section } from "@/components/ui/section"
import { CheckCircle2 } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

const features = [
    {
        title: "Vendor-Neutral Recommendations",
        description: "We prioritize your needs, not specific brands, ensuring unbiased hardware and software selection.",
    },
    {
        title: "Enterprise-Grade Execution",
        description: "Bringing Fortune 500 standards to businesses of all sizes with rigorous quality control.",
    },
    {
        title: "Single Point of Accountability",
        description: "One partner for all your IT needs, eliminating vendor blame games and simplifying management.",
    },
    {
        title: "Scalable Solutions",
        description: "Infrastructure designed to grow with you, from startup phase to enterprise scale.",
    },
    {
        title: "Proactive Maintenance",
        description: "We fix issues before they impact your business, ensuring maximum uptime and productivity.",
    },
    {
        title: "Cost-Effective Optimization",
        description: "Strategic planning to maximize your IT budget and reduce unnecessary overhead.",
    },
]

export function WhyUs() {
    return (
        <Section id="why-us" className="bg-background">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <ScrollReveal>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Partner with PAPERBOX?</h2>
                        <p className="text-lg text-muted-foreground mb-8">
                            We combine technical expertise with business acumen to deliver IT solutions that drive real value.
                            Our commitment to excellence sets us apart.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {features.map((feature) => (
                                <div key={feature.title} className="flex flex-col gap-2">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                        <h3 className="font-semibold leading-tight">{feature.title}</h3>
                                    </div>
                                    <p className="text-sm text-muted-foreground pl-7">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
                <ScrollReveal delay={0.2}>
                    <div className="relative h-[500px] rounded-2xl overflow-hidden bg-muted hidden lg:block">
                        {/* Abstract visual representation instead of stock photo */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-4 opacity-20">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="w-24 h-24 rounded-lg bg-primary/20 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </Section>
    )
}
