"use client"

import { Section } from "@/components/ui/section"

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-background">
            <Section className="py-20">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                    <div className="prose prose-lg dark:prose-invert">
                        <p>Last Updated: December 19, 2025</p>
                        <p>
                            Please read these Terms of Service carefully before using the PAPERBOX LLP website or services.
                        </p>
                        <h3>Acceptance of Terms</h3>
                        <p>
                            By accessing or using our website, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
                        </p>
                        <h3>Use of Services</h3>
                        <p>
                            You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for ensuring that your use of the website does not violate any applicable laws or regulations.
                        </p>
                        <h3>Intellectual Property</h3>
                        <p>
                            The content, features, and functionality of this website are owned by PAPERBOX LLP and are protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                        <h3>Limitation of Liability</h3>
                        <p>
                            In no event shall PAPERBOX LLP be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the website or services.
                        </p>
                    </div>
                </div>
            </Section>
        </div>
    )
}
