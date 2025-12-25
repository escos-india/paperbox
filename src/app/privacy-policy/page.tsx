"use client"

import { Section } from "@/components/ui/section"

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="py-20">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                    <div className="prose prose-lg dark:prose-invert">
                        <p>Last Updated: December 19, 2025</p>
                        <p>
                            At PAPERBOX LLP, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website or engage with our services.
                        </p>
                        <h3>Information We Collect</h3>
                        <p>
                            We collect information you provide directly to us, such as when you fill out a contact form, request a quote, or communicate with us. This may include your name, email address, phone number, company name, and any other information you choose to provide.
                        </p>
                        <h3>How We Use Your Information</h3>
                        <p>
                            We use the information we collect to provide, maintain, and improve our services, to respond to your inquiries, and to communicate with you about our products and services.
                        </p>
                        <h3>Data Protection</h3>
                        <p>
                            We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                        <h3>Contact Us</h3>
                        <p>
                            If you have any questions about this Privacy Policy, please contact us at contact@paperbox.com.
                        </p>
                    </div>
                </div>
            </Section>
        </div>
    )
}
