import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { HeroAnimation } from "@/components/ui/hero-animation"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background pt-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Text Content */}
                    <div className="relative z-10 text-left">
                        <ScrollReveal delay={0.2}>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight mb-6 leading-tight">
                                Scalable Infrastructure for <br className="hidden lg:block" />
                                <span className="text-primary">Modern Enterprises</span>
                            </h1>
                        </ScrollReveal>

                        <ScrollReveal delay={0.4}>
                            <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-6 leading-relaxed">
                                End-to-end IT management, procurement, and support.
                                We build the digital backbone that powers your business growth.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={0.6}>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="tel:+917058433905">
                                    <Button size="lg" className="h-11 px-8 text-sm border border-black">
                                        Talk to an Expert <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </a>
                                <Link href="/services">
                                    <Button variant="outline" size="lg" className="h-11 px-8 text-sm">
                                        Explore Services
                                    </Button>
                                </Link>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Right Column: Animation */}
                    <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
                        <HeroAnimation />
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted-foreground hidden lg:block">
                <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-current rounded-full" />
                </div>
            </div>
        </section>
    )
}
