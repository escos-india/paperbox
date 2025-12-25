import { Section } from "@/components/ui/section"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, GraduationCap, Stethoscope, Factory, Rocket, Users } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

const industries = [
    { name: "Startups", icon: Rocket },
    { name: "SMBs", icon: Building2 },
    { name: "Enterprises", icon: Users },
    { name: "Education", icon: GraduationCap },
    { name: "Healthcare", icon: Stethoscope },
    { name: "Manufacturing", icon: Factory },
]

export function Industries() {
    return (
        <Section id="industries" className="bg-primary text-primary-foreground">
            <ScrollReveal>
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Industries We Serve</h2>
                    <p className="text-lg text-primary-foreground/80">
                        Tailored IT solutions for diverse sectors, understanding unique challenges and compliance requirements.
                    </p>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {industries.map((industry, index) => (
                    <ScrollReveal key={industry.name} delay={index * 0.1}>
                        <Card className="bg-primary-foreground/10 border-none text-primary-foreground hover:bg-primary-foreground/20 transition-colors">
                            <CardContent className="flex flex-col items-center justify-center p-6 h-40">
                                <industry.icon className="h-10 w-10 mb-4 opacity-80" />
                                <span className="font-semibold">{industry.name}</span>
                            </CardContent>
                        </Card>
                    </ScrollReveal>
                ))}
            </div>
        </Section>
    )
}
