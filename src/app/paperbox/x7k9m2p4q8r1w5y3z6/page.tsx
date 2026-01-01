"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export default function SuperSecretAdminLoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // Admin State
    const [adminStep, setAdminStep] = useState<'init' | 'otp'>('init')
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [secretKey, setSecretKey] = useState("")
    const [otp, setOtp] = useState("")
    const [maskedPhone, setMaskedPhone] = useState("")
    const { adminLoginInit, adminLoginVerify, logout } = useAuth()

    // Admin Login Handler
    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        console.log("SENDING ADMIN LOGIN:", { email, password, secretKey }) // DEBUG

        if (adminStep === 'init') {
            const result = await adminLoginInit(email, password, secretKey)
            setIsLoading(false)
            if (result.success) {
                toast.success(result.message || "OTP Sent")
                setMaskedPhone(result.phone || "")
                setAdminStep('otp')
            } else {
                toast.error(result.message || "Invalid credentials")
            }
        } else {
            const result = await adminLoginVerify(email, otp)
            setIsLoading(false)
            if (result.success && result.user) {
                if (result.user.role === 'admin') {
                    toast.success("Admin login successful")
                    router.push("/paperbox/admin/dashboard")
                } else {
                    toast.error("Access Denied: Not an Admin")
                    logout()
                }
            } else {
                toast.error(result.message || "Invalid OTP")
            }
        }
    }

    return (
        <Section className="min-h-[80vh] flex items-center justify-center bg-muted/30">
            <Card className="w-full max-w-md border-red-200 shadow-red-100">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-red-600">Restricted Access</CardTitle>
                    <CardDescription>Super Admin Login Only</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        {adminStep === 'init' ? (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        className="w-full p-2 border rounded-md bg-background"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@paperbox.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <input
                                        type="password"
                                        className="w-full p-2 border rounded-md bg-background"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Secret Key</label>
                                    <input
                                        type="password"
                                        className="w-full p-2 border rounded-md bg-background"
                                        value={secretKey}
                                        onChange={(e) => setSecretKey(e.target.value)}
                                        placeholder="Enter secret key"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Next: Verify Identity
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Enter OTP sent to {maskedPhone}</label>
                                    <div className="flex justify-center">
                                        <input
                                            type="text"
                                            maxLength={6}
                                            className="w-full p-2 border rounded-md bg-background text-center text-2xl tracking-widest"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="000000"
                                            required
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Verify & Login
                                </Button>
                                <Button type="button" variant="ghost" className="w-full" onClick={() => setAdminStep('init')} disabled={isLoading}>
                                    Back
                                </Button>
                            </>
                        )}
                    </form>
                </CardContent>
            </Card>
        </Section>
    )
}
