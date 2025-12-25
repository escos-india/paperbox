"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, PenTool, Rocket, ShieldCheck, BarChart } from "lucide-react"

const steps = [
    {
        title: "Assess",
        icon: Search,
        description: "We begin by auditing your current infrastructure, identifying bottlenecks, security gaps, and inefficiencies. We gather requirements from key stakeholders to understand your business goals.",
        outputs: ["Infrastructure Audit Report", "Gap Analysis", "Requirements Document"]
    },
    {
        title: "Design",
        icon: PenTool,
        description: "Our architects design a vendor-neutral solution tailored to your needs. We focus on scalability, security, and total cost of ownership, ensuring the design is future-proof.",
        outputs: ["Network Topology Diagrams", "Hardware Bill of Materials", "Deployment Plan"]
    },
    {
        title: "Deploy",
        icon: Rocket,
        description: "Execution is our core strength. We procure hardware, configure devices, and install infrastructure with minimal disruption to your operations. We follow strict SOPs for every installation.",
        outputs: ["Configured Hardware", "Network Connectivity", "User Acceptance Testing (UAT)"]
    },
    {
        title: "Maintain",
        icon: ShieldCheck,
        description: "Post-deployment, we ensure stability through proactive maintenance. We monitor systems, apply patches, and resolve issues before they impact your business.",
        outputs: ["Uptime Reports", "Patch Management Logs", "SLA Compliance"]
    },
    {
        title: "Optimize",
        icon: BarChart,
        description: "IT is not static. We continuously review performance data to optimize configurations, reduce costs, and recommend upgrades as your business scales.",
        outputs: ["Quarterly Business Reviews", "Optimization Recommendations", "Cost Analysis"]
    }
]

export default function ProcessPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="bg-secondary/20 py-20">
                <div className="container mx-auto max-w-7xl text-center">
                    <h1 className="text-4xl font-bold mb-4">Our Process</h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        A disciplined, five-step framework for delivering enterprise IT excellence.
                    </p>
                    <Link href="/contact">
                        <Button size="lg">Start Your Assessment</Button>
                    </Link>
                </div>
            </Section>

            <Section className="py-20">
                <div className="container mx-auto max-w-7xl">
                    <div className="flex flex-wrap gap-8 items-stretch justify-center relative">
                        {steps.map((step, index) => (
                            <div key={index} className="flex-1 min-w-[300px] flex flex-col items-center relative group">
                                {/* Connector Line (Horizontal) */}
                                {index !== steps.length - 1 && (
                                    <div className="hidden lg:block absolute left-[calc(50%+32px)] top-8 right-[-16px] h-0.5 bg-border z-0" />
                                )}

                                <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center z-10 bg-background mb-6 ring-8 ring-background">
                                    <step.icon className="h-8 w-8 text-primary" />
                                </div>

                                <Card className="flex-1 w-full flex flex-col">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="text-xl text-center">
                                            0{index + 1}. {step.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col">
                                        <p className="text-muted-foreground mb-6 text-sm flex-1">
                                            {step.description}
                                        </p>
                                        <div className="bg-muted p-4 rounded-lg mt-auto">
                                            <h4 className="font-semibold mb-2 text-xs uppercase tracking-wider text-muted-foreground">Deliverables</h4>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                                {step.outputs.map((output, i) => (
                                                    <li key={i}>{output}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    )
}
