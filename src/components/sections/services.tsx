import { Section } from "@/components/ui/section"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Server, Shield, Laptop, Network, Headphones, Settings } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

const services = [
    {
        title: "IT Infrastructure Procurement",
        description: "Strategic sourcing of enterprise-grade hardware including servers, networking gear, and end-user devices.",
        icon: Server,
    },
    {
        title: "Network & Server Setup",
        description: "Design and deployment of robust, scalable network architectures and server environments.",
        icon: Network,
    },
    {
        title: "End-User Device Management",
        description: "Comprehensive lifecycle management for laptops, desktops, and mobile devices.",
        icon: Laptop,
    },
    {
        title: "IT Maintenance & AMC",
        description: "Proactive maintenance contracts ensuring your infrastructure remains optimal and secure.",
        icon: Settings,
    },
    {
        title: "Managed IT Services",
        description: "End-to-end outsourcing of your IT operations to our expert team.",
        icon: Shield,
    },
    {
        title: "On-site & Remote Support",
        description: "24/7 technical support to resolve issues rapidly and minimize downtime.",
        icon: Headphones,
    },
]

export function Services() {
    return (
        <Section id="services" className="bg-background">
            <ScrollReveal>
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive IT Solutions</h2>
                    <p className="text-lg text-muted-foreground">
                        We provide a full spectrum of IT services designed to support your business at every stage of growth.
                    </p>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                    <ScrollReveal key={service.title} delay={index * 0.1}>
                        <Card className="group hover:shadow-lg transition-all duration-300 border-muted bg-card/50 hover:bg-card h-full">
                            <CardHeader>
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                    <service.icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="mb-2">{service.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="text-base">
                                    {service.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </ScrollReveal>
                ))}
            </div>
        </Section>
    )
}
