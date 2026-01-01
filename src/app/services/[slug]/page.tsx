"use client"

import { servicesData } from "@/lib/services-data"
import { notFound } from "next/navigation"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"

export default function ServicePage({ params }: { params: { slug: string } }) {
    const service = servicesData.find((s) => s.id === params.slug)

    if (!service) {
        notFound()
    }

    const Icon = service.icon

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative py-20 md:py-32 bg-slate-950 text-white overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05] -z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-xl mb-6 backdrop-blur-sm">
                            <Icon className="h-8 w-8 text-primary-400" />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{service.title}</h1>
                        <p className="text-xl md:text-2xl text-slate-300 leading-relaxed">
                            {service.fullDescription}
                        </p>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <Section className="bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Execution Strategy</h2>
                        <p className="text-lg text-muted-foreground">
                            A transparent, step-wise process ensuring project success from day one.
                        </p>
                    </div>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Connecting Line (Vertical) */}
                        <div className="absolute left-[20px] top-0 bottom-0 w-0.5 bg-border md:left-[2rem]" />

                        <div className="space-y-8">
                            {service.process.map((step, index) => (
                                <div key={index} className="relative flex items-start gap-6 md:gap-10">
                                    {/* Timeline Dot */}
                                    <div className="flex-shrink-0 w-10 h-10 md:w-16 md:h-16 rounded-full bg-background border-4 border-primary flex items-center justify-center z-10 shadow-sm mt-1">
                                        <div className="text-sm md:text-xl font-bold text-primary">
                                            {index + 1}
                                        </div>
                                    </div>

                                    {/* Content Card */}
                                    <div className="flex-1 bg-card border rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
                                        <h3 className="text-xl font-bold mb-3 text-primary">{step.title}</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* Benefits Section */}
            <Section className="bg-muted/30">
                <div className="container mx-auto px-4 md:px-6">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Key Benefits</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {service.benefits.map((benefit, index) => (
                            <div key={index} className="bg-background p-6 rounded-xl border flex flex-col items-center text-center hover:border-primary/50 transition-colors">
                                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <p className="font-medium">{benefit}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to optimize your {service.title}?</h2>
                    <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                        Get in touch with our experts to discuss your specific requirements.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/contact">
                                Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                            <Link href="/services">
                                View All Services
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
