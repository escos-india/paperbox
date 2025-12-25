"use client"

import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="py-20">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-8">Careers at PAPERBOX</h1>
                    <div className="prose prose-lg dark:prose-invert mb-12">
                        <p>
                            We are always looking for talented individuals who are passionate about technology and committed to excellence. At PAPERBOX, we foster a culture of continuous learning, ownership, and collaboration.
                        </p>
                        <p>
                            If you are an engineer, architect, or project manager looking to work on challenging enterprise projects, we want to hear from you.
                        </p>
                    </div>

                    <div className="bg-muted p-8 rounded-lg text-center">
                        <h2 className="text-2xl font-bold mb-4">Current Openings</h2>
                        <p className="text-muted-foreground mb-6">
                            We currently don't have specific roles listed here, but we are always hiring exceptional talent.
                        </p>
                        <Link href="/contact">
                            <Button size="lg">Send Your Resume</Button>
                        </Link>
                    </div>
                </div>
            </Section>
        </div>
    )
}
