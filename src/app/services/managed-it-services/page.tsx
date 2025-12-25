"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function ManagedServicesPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="bg-secondary/20 py-20">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-4">Managed IT Services</h1>
                    <p className="text-xl text-muted-foreground mb-6">
                        Your outsourced IT department. We handle everything so you can focus on growth.
                    </p>
                    <Link href="/contact">
                        <Button size="lg">Partner With Us</Button>
                    </Link>
                </div>
            </Section>

            <Section className="py-20">
                <div className="container mx-auto max-w-4xl">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Scope of Services</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "24/7 Network Monitoring",
                                    "Helpdesk & User Support",
                                    "Cloud Infrastructure Management",
                                    "Backup & Disaster Recovery",
                                    "Vendor Management",
                                    "Strategic IT Consulting"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-6">The PAPERBOX Advantage</h2>
                            <p className="text-muted-foreground mb-4">
                                We act as an extension of your team. Our managed services model shifts IT from a capital expense to a predictable operational expense, providing you with enterprise-grade tools and expertise at a fraction of the cost of an in-house team.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    )
}
