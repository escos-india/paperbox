"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight } from "lucide-react"

export default function ProcurementPage() {
    return (
        <div className="min-h-screen w-full bg-background">

            {/* HERO */}
            <Section
                container={false}
                className="relative overflow-hidden mt-15 bg-gradient-to-b from-secondary/30 via-secondary/10 to-background !py-10 !px-6 md:!px-12"
            >
                {/* glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                </div>

                <div className="relative max-w-5xl mx-auto text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        IT Infrastructure Procurement
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-5">
                        Strategic sourcing of enterprise-grade hardware focused on
                        performance, longevity, and total cost of ownership.
                    </p>

                    <Link href="/contact">
                        <Button size="lg" className="px-8">
                            Get a Quote
                        </Button>
                    </Link>
                </div>
            </Section>

            {/* CONTENT */}
            <Section container={false} className="!py-10 !px-6 md:!px-12">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* WHAT WE OFFER */}
                    <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold mb-4">
                            What We Offer
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            {[
                                "Vendor-neutral hardware selection",
                                "Bulk procurement discounts",
                                "Global logistics & shipping",
                                "Warranty management",
                                "Asset tagging & tracking",
                                "End-of-life disposal",
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-3 text-sm md:text-base"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* EXECUTION STRATEGY */}
                    <div className="rounded-2xl border bg-muted/30 p-6">
                        <h2 className="text-2xl font-semibold mb-3">
                            Execution Strategy
                        </h2>

                        <p className="text-muted-foreground leading-relaxed max-w-4xl">
                            We don&apos;t just procure hardware — we architect outcomes.
                            Our team evaluates workload demands, future scalability, and
                            performance-per-watt to ensure every purchase aligns with your
                            operational goals. Hardware arrives pre-configured and ready
                            for rapid deployment.
                        </p>
                    </div>

                    {/* USE CASES */}
                    <div className="rounded-2xl border bg-card/60 p-6">
                        <h2 className="text-2xl font-semibold mb-4">
                            Typical Use Cases
                        </h2>

                        <ul className="space-y-3 text-muted-foreground">
                            {[
                                "Data center refreshes and consolidations",
                                "New office setups and expansions",
                                "Remote workforce equipment provisioning",
                                "High-performance computing (HPC) clusters",
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <ArrowRight className="h-4 w-4 mt-1 text-primary shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </Section>

            {/* CTA */}
            <Section
                container={false}
                className="!py-10 !px-6 md:!px-12 bg-muted/40"
            >
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-semibold mb-4">
                        Need specific hardware?
                    </h2>

                    <Link href="/hardware-catalog">
                        <Button variant="outline" className="gap-2 px-6">
                            Browse Catalog
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </Section>

        </div>
    )
}
