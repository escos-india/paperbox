"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Linkedin, Twitter, Facebook } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const footerLinks = {
    company: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Partners", href: "/partners" },
        { name: "Contact", href: "/contact" },
    ],
    services: [
        { name: "IT Infrastructure", href: "/services/it-infrastructure-procurement" },
        { name: "Managed Services", href: "/services/managed-it-services" },
        { name: "Network Setup", href: "/services/network-server-setup" },
        { name: "Device Management", href: "/services/end-user-device-management" },
    ],
    legal: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms of Service", href: "/terms-of-service" },
        { name: "SLA", href: "/sla" },
    ],
}

export function Footer() {
    const pathname = usePathname()

    // Hide Footer only on deep admin dashboard routes (not the login page)
    if (pathname?.startsWith("/paperbox/admin/dashboard")) {
        return null
    }

    return (
        <footer className="bg-muted/30 border-t pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <Logo />
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-xs mb-6">
                            Enterprise-grade IT infrastructure and managed services for modern businesses.
                            Scalable, secure, and reliable.
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Company</h3>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Services</h3>
                        <ul className="space-y-2">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} PAPERBOX. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Designed for Enterprise Excellence.
                    </p>
                </div>
            </div>
        </footer>
    )
}
