"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"

export default function ProcurementPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <Section className="bg-secondary/20 py-20">
                <div className="container mx-auto max-w-4xl">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-4">IT Infrastructure Procurement</h1>
                            <p className="text-xl text-muted-foreground mb-6">
                                Strategic sourcing of enterprise-grade hardware with a focus on total cost of ownership, performance, and longevity.
                            </p>
                            <Link href="/contact">
                                <Button size="lg">Get a Quote</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Content */}
            <Section className="py-20">
                <div className="container mx-auto max-w-4xl">
                    <div className="space-y-12">
                        {/* What We Offer */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Vendor-neutral hardware selection",
                                    "Bulk procurement discounts",
                                    "Global logistics & shipping",
                                    "Warranty management",
                                    "Asset tagging & tracking",
                                    "End-of-life disposal"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* How We Execute */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Execution Strategy</h2>
                            <p className="text-muted-foreground mb-4">
                                We don't just buy boxes. We analyze your workload requirements, project future growth, and select hardware that offers the best performance-per-watt and reliability. Our procurement process is integrated with deployment, ensuring that equipment arrives pre-configured and ready for installation.
                            </p>
                        </div>

                        {/* Use Cases */}
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Typical Use Cases</h2>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>Data center refreshes and consolidations</li>
                                <li>New office setups and expansions</li>
                                <li>Remote workforce equipment provisioning</li>
                                <li>High-performance computing (HPC) clusters</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Section>

            {/* CTA */}
            <Section className="bg-muted py-12">
                <div className="container mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">Need specific hardware?</h2>
                    <Link href="/hardware-catalog">
                        <Button variant="outline" className="gap-2">
                            Browse Catalog <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </Section>
        </div>
    )
}
