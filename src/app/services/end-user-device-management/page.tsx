"use client"

import Link from "next/link"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function DeviceManagementPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="bg-secondary/20 py-20">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-4">End-User Device Management</h1>
                    <p className="text-xl text-muted-foreground mb-6">
                        Securing and managing your workforce's devices, wherever they are.
                    </p>
                    <Link href="/contact">
                        <Button size="lg">Secure Your Fleet</Button>
                    </Link>
                </div>
            </Section>

            <Section className="py-20">
                <div className="container mx-auto max-w-4xl">
                    <div className="space-y-12">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Services Included</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "MDM (Mobile Device Management) Implementation",
                                    "Automated Patch Management",
                                    "Endpoint Security & Antivirus",
                                    "Remote Wipe & Lock",
                                    "Zero-Touch Provisioning",
                                    "Asset Inventory Management"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-primary" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold mb-6">Why It Matters</h2>
                            <p className="text-muted-foreground mb-4">
                                With the rise of remote work, the perimeter has shifted to the endpoint. We ensure every laptop, tablet, and mobile device accessing your corporate data is compliant, secure, and up-to-date, reducing the attack surface and support overhead.
                            </p>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    )
}
