"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="bg-secondary/20 py-20">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-4">On-Site & Remote Support</h1>
                    <p className="text-xl text-muted-foreground mb-6">
                        Rapid resolution for critical IT issues, delivered where and when you need it.
                    </p>
                    <Link href="/contact">
                        <Button size="lg">Get Support Now</Button>
                    </Link>
                </div>
            </Section>

            <Section className="py-20">
                <div className="container mx-auto max-w-4xl">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Support Channels</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Remote Desktop Assistance",
                                    "On-Site Engineer Dispatch",
                                    "Phone & Email Support",
                                    "Ticket-based Tracking",
                                    "Emergency After-Hours Support",
                                    "Dedicated Account Manager"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-6">Resolution First</h2>
                            <p className="text-muted-foreground mb-4">
                                Our goal is First Contact Resolution (FCR). Whether it's a software glitch or a hardware failure, our engineers are equipped with the tools and knowledge to fix it fast, minimizing downtime for your employees.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    )
}
