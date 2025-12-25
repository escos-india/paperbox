import { Section } from "@/components/ui/section"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

const metrics = [
    { label: "Years of Experience", value: "15+" },
    { label: "Enterprise Clients", value: "500+" },
    { label: "Devices Managed", value: "50k+" },
    { label: "Uptime Guarantee", value: "99.9%" },
]

const partners = [
    "Microsoft", "Dell", "HP", "Cisco", "Lenovo", "Apple"
]

export function TrustStrip() {
    return (
        <Section className="bg-muted/30 border-y">
            <ScrollReveal>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
                    {metrics.map((metric) => (
                        <div key={metric.label} className="text-center">
                            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{metric.value}</div>
                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{metric.label}</div>
                        </div>
                    ))}
                </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
                <div className="pt-8 border-t border-border/50">
                    <p className="text-center text-sm text-muted-foreground mb-8">Trusted by industry leaders</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {partners.map((partner) => (
                            <div key={partner} className="text-xl font-bold font-sans">{partner}</div>
                        ))}
                    </div>
                </div>
            </ScrollReveal>
        </Section>
    )
}
