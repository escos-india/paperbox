"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function NetworkSetupPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="bg-secondary/20 py-20">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-4">Network & Server Setup</h1>
                    <p className="text-xl text-muted-foreground mb-6">
                        Building the backbone of your digital enterprise with robust, secure, and scalable network architectures.
                    </p>
                    <Link href="/contact">
                        <Button size="lg">Discuss Your Architecture</Button>
                    </Link>
                </div>
            </Section>

            <Section className="py-20">
                <div className="container mx-auto max-w-4xl">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Core Capabilities</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Structured Cabling (Cat6/Fiber)",
                                    "Server Rack Installation & Cable Management",
                                    "Switching & Routing Configuration",
                                    "Firewall & VPN Setup",
                                    "Wireless Site Surveys & Deployment",
                                    "Server Virtualization (VMware/Hyper-V)"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-6">Our Approach</h2>
                            <p className="text-muted-foreground mb-4">
                                We design networks for zero-trust security and high availability. From physical layer installation to logical configuration, every step is documented and validated. We ensure your infrastructure is ready for high-bandwidth applications and seamless connectivity.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    )
}
