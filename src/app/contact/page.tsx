"use client"

import { useState } from "react"
import { Section } from "@/components/ui/section"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Mail, Phone, MapPin, CheckCircle2, Loader2 } from "lucide-react"

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSuccess(true)
    }

    return (
        <div className="min-h-screen bg-background">
            <Section className="py-20">
                <div className="container mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <h1 className="text-4xl font-bold mb-6">Get IT Managed.</h1>
                            <p className="text-xl text-muted-foreground mb-12">
                                Ready to upgrade your infrastructure? Fill out the form, and our engineering team will get back to you within 24 hours.
                            </p>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Email Us</h3>
                                        <p className="text-muted-foreground">contact@paperbox.com</p>
                                        <p className="text-sm text-muted-foreground mt-1">For general enquiries and support</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                                        <p className="text-muted-foreground">+91 70584 33905</p>
                                        <p className="text-sm text-muted-foreground mt-1">Mon-Fri, 9am - 6pm IST</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Office</h3>
                                        <p className="text-muted-foreground">Nashik, Maharashtra, India</p>
                                        <p className="text-sm text-muted-foreground mt-1">Headquarters</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Send us a message</CardTitle>
                                <CardDescription>
                                    Tell us about your requirements.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {isSuccess ? (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                            <CheckCircle2 className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                                        <p className="text-muted-foreground mb-6">
                                            Thank you for reaching out. Our team will be in touch shortly.
                                        </p>
                                        <Button onClick={() => setIsSuccess(false)} variant="outline">
                                            Send Another Message
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                                <Input id="name" required placeholder="John Doe" />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="company" className="text-sm font-medium">Company</label>
                                                <Input id="company" required placeholder="Acme Corp" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                                <Input id="email" type="email" required placeholder="john@company.com" />
                                            </div>
                                            <div className="space-y-2">
                                                <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                                                <Input id="phone" type="tel" required placeholder="+91 98765 43210" />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label htmlFor="message" className="text-sm font-medium">Requirement Description</label>
                                            <Textarea
                                                id="message"
                                                required
                                                placeholder="We are looking to upgrade our server infrastructure..."
                                                className="min-h-[150px]"
                                            />
                                        </div>

                                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                "Send Message"
                                            )}
                                        </Button>
                                    </form>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </Section>
        </div>
    )
}
