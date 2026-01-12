"use client"

import { Section } from "@/components/ui/section"

export default function PrivacyPolicyPage() {
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
                        Privacy Policy
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
                        At <strong className="text-foreground">PAPERBOX LLP</strong>, we take your privacy seriously.
                        This Privacy Policy explains how we collect, use, and protect your personal information
                        when you visit our website or engage with our services.
                    </p>

                    <div className="flex flex-wrap gap-6">

                        {/* Information We Collect */}
                        <div className="flex-1 min-w-[300px] rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold mb-4">
                                Information We Collect
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We collect information you provide directly to us, such as when you fill out a
                                contact form, request a quote, or communicate with us. This may include your
                                name, email address, phone number, company name, and any other information you
                                choose to provide.
                            </p>
                        </div>

                        {/* How We Use Your Information */}
                        <div className="flex-1 min-w-[300px] rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold mb-4">
                                How We Use Your Information
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We use the information we collect to provide, maintain, and improve our services,
                                to respond to your inquiries, and to communicate with you about our products and services.
                            </p>
                        </div>

                        {/* Data Protection */}
                        <div className="flex-1 min-w-[300px] rounded-2xl border bg-muted/30 p-6">
                            <h2 className="text-2xl font-semibold mb-4">
                                Data Protection
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                We implement appropriate technical and organizational measures to protect your
                                personal data against unauthorized access, alteration, disclosure, or destruction.
                            </p>
                        </div>

                        {/* Contact Us */}
                        <div className="flex-1 min-w-[300px] rounded-2xl border bg-card/70 backdrop-blur-sm p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold mb-4">
                                Contact Us
                            </h2>
                            <p className="text-muted-foreground leading-relaxed">
                                If you have any questions about this Privacy Policy, please contact us at{" "}
                                <a
                                    href="mailto:contact@paperbox.com"
                                    className="text-primary hover:underline font-medium"
                                >
                                    contact@paperbox.com
                                </a>
                            </p>
                        </div>

                    </div>
                </div>
            </Section>

        </div>
    )
}
