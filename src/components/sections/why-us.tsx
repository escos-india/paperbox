import { Section } from "@/components/ui/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
        <Section id="why-us" className="bg-background" container={false}>
            <div className="w-full px-6 lg:px-12">
                <ScrollReveal>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Partner with PAPERBOX?</h2>
                        <p className="text-lg text-muted-foreground">
                            We combine technical expertise with business acumen to deliver IT solutions that drive real value.
                            Our commitment to excellence sets us apart.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-20">
                    {features.map((feature, index) => (
                        <ScrollReveal key={feature.title} delay={index * 0.1}>
                            <Card className="group hover:shadow-lg transition-all duration-300 border-muted bg-card/50 hover:bg-card h-full">
                                <CardHeader className="flex flex-row items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors flex-shrink-0">
                                        <CheckCircle2 className="h-6 w-6" />

                                    </div>
                                    <CardTitle>{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </Section>
    )
}

