"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Building2, Factory, Stethoscope, GraduationCap, Rocket } from "lucide-react"

const industries = [
    {
        title: "Startups",
        icon: Rocket,
        challenge: "Rapid growth and changing requirements with limited budgets.",
        solution: "Scalable cloud-first infrastructure and flexible procurement models (OpEx vs CapEx) to support rapid scaling without heavy upfront investment."
    },
    {
        title: "SMBs",
        icon: Building2,
        challenge: "Need for enterprise-grade security and reliability without an enterprise-sized IT team.",
        solution: "Managed IT Services that provide a full IT department on demand, ensuring security compliance and operational efficiency."
    },
    {
        title: "Enterprises",
        icon: Building2,
        challenge: "Complex legacy systems, compliance requirements, and multi-location management.",
        solution: "Strategic infrastructure modernization, dedicated on-site support, and rigorous SLA adherence for mission-critical systems."
    },
    {
        title: "Education",
        icon: GraduationCap,
        challenge: "High density of devices, budget constraints, and need for robust content filtering.",
        solution: "Cost-effective device lifecycle management, robust campus Wi-Fi solutions, and secure access controls for students and faculty."
    },
    {
        title: "Healthcare",
        icon: Stethoscope,
        challenge: "Strict data privacy regulations (HIPAA/DISHA) and zero-tolerance for downtime.",
        solution: "Secure, compliant network architecture, redundant storage solutions, and 24/7 monitoring to ensure patient data is always available and protected."
    },
    {
        title: "Manufacturing",
        icon: Factory,
        challenge: "Harsh environments, IoT integration, and need for real-time data connectivity.",
        solution: "Ruggedized hardware procurement, industrial-grade networking, and secure IoT gateway implementation for smart factory operations."
    }
]

export default function IndustriesPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="bg-secondary/20 py-20">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl font-bold mb-4">Industries We Serve</h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Tailored IT solutions for the unique challenges of your sector.
                    </p>
                    <Link href="/contact">
                        <Button size="lg">Find Your Solution</Button>
                    </Link>
                </div>
            </Section>

            <Section className="py-20">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {industries.map((ind, index) => (
                            <div key={index} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
                                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                    <ind.icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{ind.title}</h3>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-1">The Challenge</h4>
                                        <p className="text-sm">{ind.challenge}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-1">Our Solution</h4>
                                        <p className="text-sm">{ind.solution}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    )
}
