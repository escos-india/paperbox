"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Server, Shield, Laptop, Wrench, Cloud, Headphones } from "lucide-react"

const services = [
    {
        title: "IT Infrastructure Procurement",
        description: "Strategic sourcing of high-performance servers, networking gear, and workstations tailored to your enterprise needs.",
        icon: Server,
        href: "/services/it-infrastructure-procurement"
    },
    {
        title: "Network & Server Setup",
        description: "End-to-end design, installation, and configuration of robust network architectures and server environments.",
        icon: Cloud,
        href: "/services/network-server-setup"
    },
    {
        title: "End-User Device Management",
        description: "Comprehensive lifecycle management for laptops, desktops, and mobile devices, ensuring security and compliance.",
        icon: Laptop,
        href: "/services/end-user-device-management"
    },
    {
        title: "IT Maintenance (AMC)",
        description: "Proactive annual maintenance contracts to minimize downtime and ensure optimal performance of your IT assets.",
        icon: Wrench,
        href: "/services/it-maintenance-amc"
    },
    {
        title: "Managed IT Services",
        description: "Full-stack IT management, from monitoring to security, allowing you to focus on your core business.",
        icon: Shield,
        href: "/services/managed-it-services"
    },
    {
        title: "On-Site & Remote Support",
        description: "Rapid response technical support delivered both on-site and remotely to resolve issues swiftly.",
        icon: Headphones,
        href: "/services/on-site-remote-support"
    }
]

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <Section container={false} className="bg-secondary/20 py-8 mt-15 md:py-10">
                <div className="container mx-auto text-center max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Enterprise IT Execution
                    </h1>
                    <p className="text-xl text-muted-foreground mb-4">
                        We don't just consult; we build, deploy, and manage. PAPERBOX delivers end-to-end IT infrastructure
                        solutions with a focus on reliability, security, and scalability.
                    </p>
                    <div className="flex justify-center gap-4">
                        <a href="tel:+917058433905">
                            <Button size="lg">Talk to an Expert</Button>
                        </a>
                        <Link href="/process">
                            <Button variant="outline" size="lg">Our Process</Button>
                        </Link>
                    </div>
                </div>
            </Section>




            {/* Services Grid */}
            <Section className="">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <Card key={index} className="flex flex-col h-full hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                                        <service.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <CardTitle className="text-xl">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <CardDescription className="text-base">
                                        {service.description}
                                    </CardDescription>
                                </CardContent>
                                <CardFooter>
                                    <Link href={service.href} className="w-full">
                                        <Button variant="ghost" className="w-full justify-between group">
                                            Learn More
                                            <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </Section>

            {/* CTA Section */}
            <Section className="bg-primary text-primary-foreground">
                <div className="container mx-auto text-center max-w-3xl">
                    <h2 className="text-3xl font-bold mb-6">Ready to Optimize Your Infrastructure?</h2>
                    <p className="text-lg mb-8 opacity-90">
                        Partner with PAPERBOX for a vendor-neutral, execution-focused approach to enterprise IT.
                    </p>
                    <a href="https://wa.me/917058433905" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" variant="secondary">
                            Schedule a Consultation
                        </Button>
                    </a>
                </div>
            </Section>
        </div>
    )
}
