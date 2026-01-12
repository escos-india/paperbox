"use client"

import { Section } from "@/components/ui/section"

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen w-full bg-background">

            {/* HERO */}
            <Section
                container={false}
                className="relative overflow-hidden mt-15 bg-gradient-to-b from-secondary/30 via-secondary/10 to-background !py-10 !px-6 md:!px-12"
            >
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                </div>

                <div className="relative max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                        Terms of Service
                    </h1>
                    <p className="text-muted-foreground">
                        Last Updated: December 19, 2025
                    </p>
                </div>
            </Section>

            {/* CONTENT */}
            <Section container={false} className="!py-10 !px-6 md:!px-12">
                <div className="max-w-5xl mx-auto">

                    <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                        Please read these Terms of Service carefully before using the{" "}
                        <strong className="text-foreground">PAPERBOX LLP</strong> website or services.
                    </p>

                    <div className="flex flex-wrap gap-6">

                        {/* Acceptance of Terms */}
                        <div className="flex-1 min-w-[300px] rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold mb-4">
                                Acceptance of Terms
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                By accessing or using our website, you agree to be bound by these Terms.
                                If you disagree with any part of the terms, you may not access the service.
                            </p>
                        </div>

                        {/* Use of Services */}
                        <div className="flex-1 min-w-[300px] rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold mb-4">
                                Use of Services
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                You agree to use our services only for lawful purposes and in accordance with these Terms.
                                You are responsible for ensuring that your use of the website does not violate any applicable laws or regulations.
                            </p>
                        </div>

                        {/* Intellectual Property */}
                        <div className="flex-1 min-w-[300px] rounded-2xl border bg-muted/30 p-6">
                            <h2 className="text-2xl font-semibold mb-4">
                                Intellectual Property
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                The content, features, and functionality of this website are owned by PAPERBOX LLP
                                and are protected by international copyright, trademark, and other intellectual property laws.
                            </p>
                        </div>

                        {/* Limitation of Liability */}
                        <div className="flex-1 min-w-[300px] rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold mb-4">
                                Limitation of Liability
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                In no event shall PAPERBOX LLP be liable for any indirect, incidental, special,
                                consequential, or punitive damages arising out of or related to your use of the website or services.
                            </p>
                        </div>

                    </div>
                </div>
            </Section>

        </div>
    )
}
