import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/ui/scroll-reveal"

export function CTA() {
    return (
        <Section className="bg-background border-t">
            <ScrollReveal>
                <div className="bg-muted/30 rounded-3xl p-8 md:p-16 text-center max-w-5xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Upgrade Your IT Infrastructure?</h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        Get peace of mind with our enterprise-grade solutions.
                        Schedule a consultation today and let's build your future.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/contact" className="w-full sm:w-auto">
                            <Button size="lg" className="h-12 px-8 text-base w-full">
                                Get IT Managed
                            </Button>
                        </Link>
                        <a href="https://wa.me/917058433905" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="h-12 px-8 text-base w-full">
                                Schedule Consultation
                            </Button>
                        </a>
                    </div>
                </div>
            </ScrollReveal>
        </Section>
    )
}
