"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { useAuth } from "@/lib/auth-context"

const navigation = [
    { name: "Services", href: "/services" },
    { name: "Process", href: "/process" },
    { name: "Why Us", href: "/why-paperbox" },
    { name: "Industries", href: "/industries" },
    { name: "Catalog", href: "/catalog" },
]

export function Header() {
    const [isVisible, setIsVisible] = React.useState(true)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const lastScrollY = React.useRef(0)
    const { user, isAuthenticated, isVendor, isAdmin, logout } = useAuth()

    const handleLogout = () => {
        logout()
        router.push('/')
        setMobileMenuOpen(false)
    }

    React.useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY

            // Determine scroll direction and visibility
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false) // Scroll Down -> Hide
            } else {
                setIsVisible(true)  // Scroll Up -> Show
            }

            setIsScrolled(currentScrollY > 10)
            lastScrollY.current = currentScrollY
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Hide Header only on deep admin dashboard routes (not the login page)
    if (pathname?.startsWith("/paperbox/admin/dashboard")) {
        return null
    }

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out",
                isVisible ? "translate-y-0" : "-translate-y-full",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md border-b shadow-sm py-4"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <Logo />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}

                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            {(isAdmin || isVendor) ? (
                                <Button asChild variant="outline">
                                    <Link href="/paperbox/admin/dashboard">Dashboard</Link>
                                </Button>
                            ) : (
                                <Button asChild variant="ghost" size="icon">
                                    <Link href="/profile">
                                        <User className="h-5 w-5" />
                                    </Link>
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Button asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Join Now</Link>
                            </Button>
                        </div>
                    )}
                </nav>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-background border-b p-4 md:hidden flex flex-col gap-4 shadow-lg animate-in slide-in-from-top-5">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium py-2 border-b border-border/50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {isAuthenticated ? (
                        <>
                            {(isAdmin || isVendor) ? (
                                <Link
                                    href="/paperbox/admin/dashboard"
                                    className="text-sm font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href="/profile"
                                    className="text-sm font-medium py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    My Profile
                                </Link>
                            )}
                            <button
                                className="text-sm font-medium py-2 text-left text-red-500 hover:text-red-600 flex items-center gap-2"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Button variant="outline" className="w-full">Login</Button>
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <Button className="w-full">Join Now</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}
