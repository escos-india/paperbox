"use client"

import { servicesData } from "@/lib/services-data"
import { notFound } from "next/navigation"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export default function ServicePage({ params }: { params: { slug: string } }) {
    const service = servicesData.find((s) => s.id === params.slug)

    if (!service) {
        notFound()
    }

    const Icon = service.icon

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section - Edge to Edge */}
            <section className="relative min-h-[60vh] flex items-center justify-center bg-slate-950 text-white overflow-hidden w-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)0%,rgba(0,0,0,1)100%)]" />
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="absolute inset-0 bg-grid-white/[0.05] -z-10" />

                <div className="relative z-10 w-full px-6 lg:px-16 xl:px-24 py-20">
                    <ScrollReveal>
                        <div className="max-w-4xl">
                            <div className="inline-flex items-center justify-center p-4 bg-primary/20 rounded-2xl mb-8 backdrop-blur-xl border border-primary/30 shadow-[0_0_20px_rgba(var(--primary),0.3)]">
                                <Icon className="h-10 w-10 text-primary" />
                            </div>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 tracking-tighter leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000">
                                {service.title}
                            </h1>
                            <p className="text-xl md:text-3xl text-slate-300 leading-relaxed max-w-3xl font-light">
                                {service.fullDescription}
                            </p>
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            {/* Process Section - Full Width, No Top/Bottom Gaps */}
            <Section className="bg-white dark:bg-slate-900 py-24 md:py-32 border-y border-slate-200 dark:border-slate-800" container={false}>
                <div className="w-full px-6 lg:px-16 xl:px-24">
                    <ScrollReveal>
                        <div className="mb-20">
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Execution Strategy</h2>
                            <div className="h-2 w-24 bg-primary rounded-full mb-6" />
                            <p className="text-xl text-muted-foreground max-w-2xl font-light">
                                Our refined approach to delivering excellence, ensuring every project is handled with precision and care.
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-slate-100 dark:border-slate-800">
                        {service.process.map((step, index) => (
                            <ScrollReveal key={index} delay={index * 0.1}>
                                <div className="group relative p-10 md:p-12 border-r border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-500 h-full">
                                    <div className="absolute top-0 left-0 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500" />
                                    <div className="text-5xl font-black text-slate-100 dark:text-slate-800 mb-8 group-hover:text-primary/20 transition-colors duration-500">
                                        0{index + 1}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white group-hover:translate-x-2 transition-transform duration-500">
                                        {step.title}
                                    </h3>
                                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                                        {step.description}
                                    </p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Benefits Section - Dark Mode, High Contrast, Full Width */}
            <Section className="bg-slate-950 text-white py-24 md:py-32" container={false}>
                <div className="w-full px-6 lg:px-16 xl:px-24 text-center">
                    <ScrollReveal>
                        <h2 className="text-4xl md:text-6xl font-bold mb-16 tracking-tight">Key Advantages</h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {service.benefits.map((benefit, index) => (
                            <ScrollReveal key={index} delay={index * 0.1}>
                                <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-3xl flex flex-col items-center justify-center text-center group hover:bg-primary hover:border-primary transition-all duration-500">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-primary transition-all duration-500">
                                        <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <p className="text-xl font-medium tracking-tight group-hover:scale-110 transition-transform duration-500">{benefit}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </Section>

            {/* CTA Section - Seamless Transition */}
            <section className="relative py-32 md:py-48 px-6 lg:px-16 xl:px-24 bg-primary text-primary-foreground overflow-hidden w-full">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(255,255,255,0.1)0%,transparent0%)]" />
                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <ScrollReveal>
                        <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">Ready to Scale?</h2>
                        <p className="text-xl md:text-2xl opacity-90 mb-12 font-light leading-relaxed">
                            Let's build your enterprise-grade infrastructure together. Our experts are ready to turn your vision into a robust digital reality.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Button size="lg" variant="secondary" className="h-16 px-12 text-lg font-bold rounded-full shadow-2xl hover:scale-105 transition-transform" asChild>
                                <Link href="/contact">
                                    Start Your Project <ArrowRight className="ml-3 h-6 w-6" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-16 px-12 text-lg font-medium rounded-full bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-white hover:text-primary hover:border-white transition-all" asChild>
                                <Link href="/services">
                                    Browse Solutions
                                </Link>
                            </Button>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    )
}
