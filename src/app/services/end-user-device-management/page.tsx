"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function DeviceManagementPage() {
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
                        End-User Device Management
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mb-5">
                        Secure, monitor, and manage every employee device — from anywhere —
                        with enterprise-grade protection and zero friction.
                    </p>

                    <Link href="/contact">
                        <Button size="lg" className="px-8">
                            Secure Your Fleet
                        </Button>
                    </Link>
                </div>
            </Section>

            {/* CONTENT */}
            <Section container={false} className="!py-10 !px-6 md:!px-12">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* SERVICES CARD */}
                    <div className="rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold mb-4">
                            Services Included
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            {[
                                "MDM (Mobile Device Management) Implementation",
                                "Automated Patch Management",
                                "Endpoint Security & Antivirus",
                                "Remote Wipe & Lock",
                                "Zero-Touch Provisioning",
                                "Asset Inventory Management",
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

                    {/* WHY IT MATTERS */}
                    <div className="rounded-2xl border bg-muted/30 p-6">
                        <h2 className="text-2xl font-semibold mb-3">
                            Why It Matters
                        </h2>

                        <p className="text-muted-foreground leading-relaxed max-w-4xl">
                            With the rise of remote and hybrid work, security has moved beyond
                            the office perimeter. Every endpoint is now a potential attack surface.
                            We help you enforce compliance, prevent data loss, and reduce IT overhead
                            by keeping all devices secure, visible, and fully managed at all times.
                        </p>
                    </div>

                </div>
            </Section>

        </div>
    )
}
