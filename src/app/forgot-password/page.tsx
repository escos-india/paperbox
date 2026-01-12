"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { OTPInput } from "@/components/ui/otp-input"
import { Loader2, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"

export default function VendorForgotPasswordPage() {
    const [step, setStep] = useState<'IDENTIFIER' | 'RESET'>('IDENTIFIER')
    const [identifier, setIdentifier] = useState("")
    const [otp, setOtp] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [maskedPhone, setMaskedPhone] = useState("")
    const [devOtp, setDevOtp] = useState("")

    const router = useRouter()
    const { vendorForgotPasswordInit, vendorForgotPasswordReset } = useAuth()

    const handleInit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!identifier) return

        setIsLoading(true)
        const result = await vendorForgotPasswordInit(identifier)
        setIsLoading(false)

        if (result.success) {
            setMaskedPhone(result.phone || "")
            setStep('RESET')
            if (result.devOtp) {
                setDevOtp(result.devOtp)
                toast.success(`Dev Mode OTP: ${result.devOtp}`, { duration: 5000 })
            } else {
                toast.success(result.message || "OTP sent to your registered phone number")
            }
        } else {
            toast.error(result.message || "Vendor not found")
        }
    }

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        if (otp.length !== 6) {
            toast.error("Please enter 6-digit OTP")
            return
        }
        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match")
            return
        }

        setIsLoading(true)
        const result = await vendorForgotPasswordReset(identifier, otp, newPassword)
        setIsLoading(false)

        if (result.success) {
            toast.success("Password reset successful. Please login.")
            router.push("/paperbox/admin")
        } else {
            toast.error(result.message || "Failed to reset password")
            setOtp("")
        }
    }

    return (
        <Section className="min-h-[80vh] flex items-center justify-center bg-muted/30">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <div className="mb-2">
                        <Link
                            href="/paperbox/admin"
                            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 w-fit"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Login
                        </Link>
                    </div>
                    <CardTitle className="text-2xl">Reset Vendor Password</CardTitle>
                    <CardDescription>
                        {step === 'IDENTIFIER'
                            ? "Enter your email or phone number to receive a verification code."
                            : `Enter the code sent to ${maskedPhone} and set your new password.`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'IDENTIFIER' ? (
                        <form onSubmit={handleInit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email or Phone Number</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="vendor@email.com or 9876543210"
                                    required
                                    autoFocus
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading || !identifier}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Verification Code
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium block text-center">Verification Code</label>
                                <div className="flex justify-center">
                                    <OTPInput
                                        length={6}
                                        value={otp}
                                        onChange={setOtp}
                                        disabled={isLoading}
                                    />
                                </div>
                                {devOtp && (
                                    <p className="text-xs text-center text-muted-foreground">Dev OTP: {devOtp}</p>
                                )}
                            </div>

                            <div className="space-y-2 pt-2">
                                <label className="text-sm font-medium">New Password</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border rounded-md bg-background"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Min 6 characters"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="w-full p-2 border rounded-md bg-background"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat new password"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Reset Password
                            </Button>

                            <button
                                type="button"
                                onClick={() => { setStep('IDENTIFIER'); setOtp(""); setDevOtp("") }}
                                className="text-sm text-muted-foreground hover:text-primary w-full text-center hover:underline"
                            >
                                Change Email/Phone
                            </button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </Section>
    )
}
