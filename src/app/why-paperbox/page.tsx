"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function WhyUsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="bg-secondary/20 py-20">
                <div className="container mx-auto max-w-7xl text-center">
                    <h1 className="text-4xl font-bold mb-4">Why PAPERBOX?</h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        We bridge the gap between strategy and execution. No fluff, just results.
                    </p>
                    <Link href="/contact">
                        <Button size="lg">Work With Us</Button>
                    </Link>
                </div>
            </Section>

            <Section className="py-20">
                <div className="container mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Vendor Neutrality</h2>
                            <p className="text-muted-foreground">
                                We are not tied to a single OEM. We recommend what's best for your business, whether it's Dell, HP, Cisco, or a hybrid approach. Our loyalty is to your requirements, not a vendor's quota.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Single Point of Accountability</h2>
                            <p className="text-muted-foreground">
                                Stop juggling multiple vendors for hardware, cabling, software, and support. PAPERBOX owns the entire stack. If something breaks, you call us, and we fix it.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Enterprise Execution Standards</h2>
                            <p className="text-muted-foreground">
                                We bring Fortune 500 IT standards to every project. From neat cable management to detailed documentation and strict security protocols, we don't cut corners.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">SLA-Driven Operations</h2>
                            <p className="text-muted-foreground">
                                We define clear Service Level Agreements (SLAs) for uptime and response times. We measure our performance against these metrics and report them to you transparently.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Proactive Maintenance</h2>
                            <p className="text-muted-foreground">
                                We believe in preventing fires, not just fighting them. Our proactive monitoring and maintenance schedules ensure that your infrastructure runs smoothly, reducing emergency calls.
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-4">Cost Efficiency</h2>
                            <p className="text-muted-foreground">
                                By optimizing your infrastructure and preventing downtime, we lower your Total Cost of Ownership (TCO). We help you spend smarter, not harder.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    )
}
