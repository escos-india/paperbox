"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export default function VendorLoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    // Vendor State
    const [vendorEmail, setVendorEmail] = useState("")
    const [vendorPassword, setVendorPassword] = useState("")

    const { vendorLogin, logout } = useAuth()

    // Vendor Login Handler
    const handleVendorLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const result = await vendorLogin(vendorEmail, vendorPassword)
        setIsLoading(false)
        if (result.success && result.user) {
            if (result.user.role === 'vendor') {
                toast.success("Login successful")
                router.push("/paperbox/admin/dashboard")
            } else {
                toast.error("This account is not a Vendor.")
                logout()
            }
        } else {
            toast.error(result.message || "Invalid credentials")
        }
    }

    return (
        <Section className="min-h-[80vh] flex items-center justify-center bg-muted/30">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Vendor Portal</CardTitle>
                    <CardDescription>Login to manage your catalogue</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleVendorLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="email"
                                className="w-full p-2 border rounded-md bg-background"
                                value={vendorEmail}
                                onChange={(e) => setVendorEmail(e.target.value)}
                                placeholder="vendor@paperbox.com"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <input
                                type="password"
                                className="w-full p-2 border rounded-md bg-background"
                                value={vendorPassword}
                                onChange={(e) => setVendorPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                            <div className="flex justify-end">
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-primary hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Login as Vendor
                        </Button>
                        <div className="text-center mt-4">
                            <p className="text-sm text-muted-foreground">
                                New vendor? <Link href="/register" className="text-primary hover:underline">Register Here</Link>
                            </p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </Section>
    )
}
