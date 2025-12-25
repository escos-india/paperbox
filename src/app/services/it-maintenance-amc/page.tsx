"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function AMCPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="bg-secondary/20 py-20">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-4">IT Maintenance (AMC)</h1>
                    <p className="text-xl text-muted-foreground mb-6">
                        Guaranteed uptime and performance through comprehensive Annual Maintenance Contracts.
                    </p>
                    <Link href="/contact">
                        <Button size="lg">Get an AMC Quote</Button>
                    </Link>
                </div>
            </Section>

            <Section className="py-20">
                <div className="container mx-auto max-w-4xl">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Contract Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Scheduled Preventive Maintenance",
                                    "SLA-backed Response Times",
                                    "Spare Parts Replacement",
                                    "On-site Engineer Visits",
                                    "Quarterly Health Checks",
                                    "Priority Support Desk Access"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-6">Proactive vs. Reactive</h2>
                            <p className="text-muted-foreground mb-4">
                                Don't wait for things to break. Our AMC services focus on preventive maintenance—cleaning, updating, and optimizing hardware before failures occur. This extends the lifespan of your assets and ensures business continuity.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    )
}
