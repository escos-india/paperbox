"use client"

import { Section } from "@/components/ui/section"

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="py-20">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-8">About PAPERBOX</h1>
                    <div className="prose prose-lg dark:prose-invert">
                        <p>
                            PAPERBOX LLP is a premier IT infrastructure solutions provider dedicated to delivering enterprise-grade execution for businesses of all sizes. Founded on the principles of reliability, vendor neutrality, and technical excellence, we have established ourselves as a trusted partner for organizations seeking to optimize their digital backbone.
                        </p>
                        <p>
                            Our mission is simple: to bridge the gap between complex IT strategy and flawless on-ground execution. We believe that technology should be an enabler, not a bottleneck. By taking full ownership of the IT stack—from procurement to maintenance—we empower our clients to focus on innovation while we handle the infrastructure.
                        </p>
                        <p>
                            With a team of certified engineers, solution architects, and project managers, PAPERBOX brings a disciplined, process-driven approach to every engagement. Whether you are a startup setting up your first office or an enterprise consolidating data centers, we deliver results that are on time, on budget, and built to last.
                        </p>
                    </div>
                </div>
            </Section>
        </div>
    )
}
