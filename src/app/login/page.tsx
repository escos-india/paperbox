"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { OTPInput } from "@/components/ui/otp-input"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

export default function LoginPage() {
    const [step, setStep] = useState<'IDENTIFIER' | 'OTP'>('IDENTIFIER')
    const [identifier, setIdentifier] = useState("")
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [devOtp, setDevOtp] = useState("")

    const router = useRouter()
    const { sendOTP, verifyOTP } = useAuth()

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()

        const emailRegex = /^\S+@\S+\.\S+$/;

        if (!emailRegex.test(identifier)) {
            toast.error("Please enter a valid Email Address")
            return
        }

        setIsLoading(true)
        const result = await sendOTP(identifier)
        setIsLoading(false)

        if (result.success) {
            setStep('OTP')
            if (result.devOtp) {
                setDevOtp(result.devOtp)
                toast.success(`Dev Mode OTP: ${result.devOtp}`, { duration: 5000 })
            } else {
                toast.success(`OTP sent to ${identifier}`)
            }
        } else {
            toast.error(result.message || "Failed to send OTP")
        }
    }

    const handleVerify = async () => {
        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP")
            return
        }

        setIsLoading(true)
        const result = await verifyOTP(identifier, otp)
        setIsLoading(false)

        if (result.success) {
            toast.success(result.isNewUser ? "Account created successfully!" : "Logged in successfully!")
            router.push("/profile")
        } else {
            toast.error(result.message || "Invalid OTP")
            setOtp("")
        }
    }

    return (
        <Section className="min-h-[80vh] flex items-center justify-center bg-muted/30">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {step === 'IDENTIFIER' ? 'Welcome Back' : 'Verify Email'}
                    </CardTitle>
                    <CardDescription>
                        {step === 'IDENTIFIER'
                            ? 'Enter your email address to continue'
                            : `Enter the 6-digit code sent to ${identifier}`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'IDENTIFIER' ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Email Address</label>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        className="flex-1 p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        placeholder="user@example.com"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send OTP
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <div className="flex justify-center">
                                <OTPInput
                                    length={6}
                                    value={otp}
                                    onChange={setOtp}
                                    disabled={isLoading}
                                />
                            </div>

                            {devOtp && (
                                <div className="p-3 text-center bg-yellow-50 text-yellow-800 text-sm rounded-md border border-yellow-200">
                                    Dev OTP: <strong>{devOtp}</strong>
                                </div>
                            )}

                            <Button onClick={handleVerify} className="w-full" disabled={isLoading || otp.length !== 6}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify & Continue
                            </Button>

                            <div className="text-center">
                                <button
                                    onClick={() => { setStep('IDENTIFIER'); setOtp(""); setDevOtp("") }}
                                    className="text-sm text-muted-foreground hover:text-primary underline"
                                >
                                    Change Email
                                </button>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-6 mt-2">
                    <p className="text-sm text-muted-foreground">
                        Vendor? <Link href="/paperbox/admin" className="text-primary hover:underline">Vendor Login</Link>
                    </p>
                </CardFooter>
            </Card>
        </Section>
    )
}
