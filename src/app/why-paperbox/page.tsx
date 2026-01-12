"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Scale, Users, Award, Clock, Wrench, PiggyBank } from "lucide-react"

const features = [
    {
        title: "Vendor Neutrality",
        description: "We are not tied to a single OEM. We recommend what's best for your business, whether it's Dell, HP, Cisco, or a hybrid approach. Our loyalty is to your requirements, not a vendor's quota.",
        icon: Scale,
    },
    {
        title: "Single Point of Accountability",
        description: "Stop juggling multiple vendors for hardware, cabling, software, and support. PAPERBOX owns the entire stack. If something breaks, you call us, and we fix it.",
        icon: Users,
    },
    {
        title: "Enterprise Execution Standards",
        description: "We bring Fortune 500 IT standards to every project. From neat cable management to detailed documentation and strict security protocols, we don't cut corners.",
        icon: Award,
    },
    {
        title: "SLA-Driven Operations",
        description: "We define clear Service Level Agreements (SLAs) for uptime and response times. We measure our performance against these metrics and report them to you transparently.",
        icon: Clock,
    },
    {
        title: "Proactive Maintenance",
        description: "We believe in preventing fires, not just fighting them. Our proactive monitoring and maintenance schedules ensure that your infrastructure runs smoothly, reducing emergency calls.",
        icon: Wrench,
    },
    {
        title: "Cost Efficiency",
        description: "By optimizing your infrastructure and preventing downtime, we lower your Total Cost of Ownership (TCO). We help you spend smarter, not harder.",
        icon: PiggyBank,
    },
]

export default function WhyUsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section
                container={false}
                className="relative overflow-hidden mt-15 bg-gradient-to-b from-secondary/30 via-secondary/10 to-background !py-10 !px-6 md:!px-12"
            >
                <div className="text-center">
                    <ScrollReveal>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Why PAPERBOX?</h1>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            We bridge the gap between strategy and execution. No fluff, just results.
                        </p>
                        <Link href="/contact">
                            <Button size="lg">Work With Us</Button>
                        </Link>
                    </ScrollReveal>
                </div>
            </Section>

            <Section className="py-12 md:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-full px-6 lg:px-16 xl:px-24">
                    {features.map((feature, index) => (
                        <ScrollReveal key={feature.title} delay={index * 0.1}>
                            <Card className="group hover:shadow-xl transition-all duration-500 border-muted/60 bg-card/40 hover:bg-card h-full">
                                <CardHeader className="flex flex-row items-center gap-6 p-8 pb-4">
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 flex-shrink-0">
                                        <feature.icon className="h-7 w-7" />
                                    </div>
                                    <CardTitle className="text-xl leading-tight">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-8 pt-0">
                                    <CardDescription className="text-base leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </ScrollReveal>
                    ))}
                </div>
            </Section>
        </div>
    )
}

