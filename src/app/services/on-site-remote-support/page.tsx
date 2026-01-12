"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function SupportPage() {
    return (
        <div className="min-h-screen w-full bg-background">

            {/* HERO */}
            <Section
                container={false}
                className="relative overflow-hidden mt-15 bg-gradient-to-b from-secondary/30 via-secondary/10 to-background !py-10 !px-6 md:!px-12"
            >
                {/* subtle glow */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                </div>

                <div className="relative max-w-5xl mx-auto text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        On-Site & Remote Support
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-5">
                        Rapid resolution for critical IT issues, delivered where and when you need it.
                    </p>

                    <Link href="/contact">
                        <Button size="lg" className="px-8">
                            Get Support Now
                        </Button>
                    </Link>
                </div>
            </Section>

            {/* CONTENT */}
            <Section container={false} className="!py-10 !px-6 md:!px-12">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* SUPPORT CHANNELS */}
                    <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold mb-4">
                            Support Channels
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            {[
                                "Remote Desktop Assistance",
                                "On-Site Engineer Dispatch",
                                "Phone & Email Support",
                                "Ticket-based Tracking",
                                "Emergency After-Hours Support",
                                "Dedicated Account Manager",
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

                    {/* RESOLUTION FIRST */}
                    <div className="rounded-2xl border bg-muted/30 p-6">
                        <h2 className="text-2xl font-semibold mb-3">
                            Resolution First
                        </h2>

                        <p className="text-muted-foreground leading-relaxed max-w-4xl">
                            Our goal is First Contact Resolution (FCR). Whether it's a software glitch
                            or a hardware failure, our engineers are equipped with the tools and
                            knowledge to fix it fast, minimizing downtime for your employees.
                        </p>
                    </div>

                </div>
            </Section>

        </div>
    )
}
