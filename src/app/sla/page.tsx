"use client"

import { Section } from "@/components/ui/section"

export default function SLAPage() {
    return (
        <div className="min-h-screen w-full bg-background">

            {/* HERO */}
            <Section
                container={false}
                className="relative overflow-hidden mt-15 bg-gradient-to-b from-secondary/30 via-secondary/10 to-background !py-10 !px-6 md:!px-12"
            >
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                </div>

                <div className="relative max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        Service Level Agreement (SLA)
                    </h1>
                    <p className="text-muted-foreground">
                        Last Updated: December 19, 2025
                    </p>
                </div>
            </Section>

            {/* CONTENT */}
            <Section container={false} className="!py-10 !px-6 md:!px-12">
                <div className="max-w-5xl mx-auto">

                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        <strong className="text-foreground">PAPERBOX LLP</strong> is committed to delivering
                        high-performance IT services. Our Service Level Agreements define the metrics by which
                        we measure our service delivery and our commitment to you.
                    </p>

                    <div className="flex flex-wrap gap-6">

                        {/* Standard Support SLA */}
                        <div className="flex-1 min-w-[300px] rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold mb-4">
                                Standard Support SLA
                            </h2>
                            <ul className="text-muted-foreground leading-relaxed space-y-2">
                                <li><strong className="text-foreground">Critical (P1):</strong> Response within 1 hour. Resolution target 4 hours.</li>
                                <li><strong className="text-foreground">High (P2):</strong> Response within 4 hours. Resolution target 8 hours.</li>
                                <li><strong className="text-foreground">Medium (P3):</strong> Response within 8 hours. Resolution target 24 hours.</li>
                                <li><strong className="text-foreground">Low (P4):</strong> Response within 24 hours. Resolution target 48 hours.</li>
                            </ul>
                        </div>

                        {/* Uptime Guarantee */}
                        <div className="flex-1 min-w-[300px] rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold mb-4">
                                Uptime Guarantee
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                For managed infrastructure services, we guarantee 99.9% uptime. Credits are applied
                                for any downtime exceeding this threshold, as detailed in your specific service contract.
                            </p>
                        </div>

                        {/* Maintenance Windows */}
                        <div className="flex-1 min-w-[300px] rounded-2xl border bg-muted/30 p-6">
                            <h2 className="text-2xl font-semibold mb-4">
                                Maintenance Windows
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Routine maintenance is scheduled during non-business hours to minimize disruption.
                                Clients are notified at least 48 hours in advance of any planned maintenance activities.
                            </p>
                        </div>

                        {/* Escalation Process */}
                        <div className="flex-1 min-w-[300px] rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold mb-4">
                                Escalation Process
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Issues not resolved within SLA targets are automatically escalated to senior engineers
                                and management. Clients receive proactive updates throughout the resolution process.
                            </p>
                        </div>

                    </div>
                </div>
            </Section>

        </div>
    )
}
