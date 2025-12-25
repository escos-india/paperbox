"use client"

import { Section } from "@/components/ui/section"

export default function SLAPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="py-20">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-8">Service Level Agreement (SLA)</h1>
                    <div className="prose prose-lg dark:prose-invert">
                        <p>
                            PAPERBOX LLP is committed to delivering high-performance IT services. Our Service Level Agreements (SLAs) define the metrics by which we measure our service delivery and our commitment to you.
                        </p>
                        <h3>Standard Support SLA</h3>
                        <ul>
                            <li><strong>Critical Severity (P1):</strong> Response within 1 hour. Resolution target 4 hours.</li>
                            <li><strong>High Severity (P2):</strong> Response within 4 hours. Resolution target 8 hours.</li>
                            <li><strong>Medium Severity (P3):</strong> Response within 8 hours. Resolution target 24 hours.</li>
                            <li><strong>Low Severity (P4):</strong> Response within 24 hours. Resolution target 48 hours.</li>
                        </ul>
                        <h3>Uptime Guarantee</h3>
                        <p>
                            For managed infrastructure services, we guarantee 99.9% uptime. Credits are applied for any downtime exceeding this threshold, as detailed in your specific service contract.
                        </p>
                        <h3>Maintenance Windows</h3>
                        <p>
                            Routine maintenance is scheduled during non-business hours to minimize disruption. Clients are notified at least 48 hours in advance of any planned maintenance activities.
                        </p>
                    </div>
                </div>
            </Section>
        </div>
    )
}
