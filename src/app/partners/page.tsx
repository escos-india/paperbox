"use client"

import { Section } from "@/components/ui/section"

export default function PartnersPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="py-20">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-8">Our Partners</h1>
                    <div className="prose prose-lg dark:prose-invert">
                        <p>
                            PAPERBOX maintains strategic partnerships with leading global technology vendors to ensure our clients have access to the best hardware and software solutions. Our vendor-neutral approach allows us to recommend the right tools for the job, without bias.
                        </p>
                        <ul className="grid grid-cols-2 md:grid-cols-3 gap-8 list-none p-0 mt-12">
                            <li className="bg-card border rounded-lg p-6 flex items-center justify-center font-bold text-xl">Dell Technologies</li>
                            <li className="bg-card border rounded-lg p-6 flex items-center justify-center font-bold text-xl">HP Enterprise</li>
                            <li className="bg-card border rounded-lg p-6 flex items-center justify-center font-bold text-xl">Cisco</li>
                            <li className="bg-card border rounded-lg p-6 flex items-center justify-center font-bold text-xl">Fortinet</li>
                            <li className="bg-card border rounded-lg p-6 flex items-center justify-center font-bold text-xl">Microsoft</li>
                            <li className="bg-card border rounded-lg p-6 flex items-center justify-center font-bold text-xl">VMware</li>
                        </ul>
                    </div>
                </div>
            </Section>
        </div>
    )
}
