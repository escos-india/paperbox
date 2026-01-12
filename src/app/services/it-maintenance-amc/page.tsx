"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function AMCPage() {
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
                        IT Maintenance (AMC)
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-5">
                        Guaranteed uptime and peak performance through
                        comprehensive Annual Maintenance Contracts.
                    </p>

                    <Link href="/contact">
                        <Button size="lg" className="px-8">
                            Get an AMC Quote
                        </Button>
                    </Link>
                </div>
            </Section>

            {/* CONTENT */}
            <Section container={false} className="!py-10 !px-6 md:!px-12">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* CONTRACT FEATURES */}
                    <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold mb-4">
                            Contract Features
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            {[
                                "Scheduled Preventive Maintenance",
                                "SLA-backed Response Times",
                                "Spare Parts Replacement",
                                "On-site Engineer Visits",
                                "Quarterly Health Checks",
                                "Priority Support Desk Access",
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

                    {/* PROACTIVE VS REACTIVE */}
                    <div className="rounded-2xl border bg-muted/30 p-6">
                        <h2 className="text-2xl font-semibold mb-3">
                            Proactive vs. Reactive
                        </h2>

                        <p className="text-muted-foreground leading-relaxed max-w-4xl">
                            Waiting for failures is costly. Our AMC model emphasizes
                            proactive maintenance — regular cleaning, firmware updates,
                            diagnostics, and performance tuning — to prevent downtime
                            before it impacts operations. The result is longer asset
                            life, predictable costs, and uninterrupted business
                            continuity.
                        </p>
                    </div>

                </div>
            </Section>

        </div>
    )
}
