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
    const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE')
    const [phone, setPhone] = useState("")
    const [otp, setOtp] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [devOtp, setDevOtp] = useState("")

    const router = useRouter()
    const { sendOTP, verifyOTP } = useAuth()

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!/^[6-9]\d{9}$/.test(phone)) {
            toast.error("Please enter a valid 10-digit Indian phone number")
            return
        }

        setIsLoading(true)
        const result = await sendOTP(phone)
        setIsLoading(false)

        if (result.success) {
            setStep('OTP')
            if (result.devOtp) {
                setDevOtp(result.devOtp)
                toast.success(`Dev Mode OTP: ${result.devOtp}`, { duration: 5000 })
            } else {
                toast.success("OTP sent successfully")
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
        const result = await verifyOTP(phone, otp)
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
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                        {step === 'PHONE' ? 'Welcome Back' : 'Verify Phone'}
                    </CardTitle>
                    <CardDescription>
                        {step === 'PHONE'
                            ? 'Enter your phone number to continue'
                            : `Enter the 6-digit code sent to +91 ${phone}`
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'PHONE' ? (
                        <form onSubmit={handleSendOTP} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Phone Number</label>
                                <div className="flex gap-2">
                                    <span className="flex items-center justify-center w-12 border rounded-md bg-muted text-muted-foreground">
                                        +91
                                    </span>
                                    <input
                                        type="tel"
                                        className="flex-1 p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={phone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                                            setPhone(val)
                                        }}
                                        placeholder="98765 43210"
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
                                    onClick={() => { setStep('PHONE'); setOtp(""); setDevOtp("") }}
                                    className="text-sm text-muted-foreground hover:text-primary underline"
                                >
                                    Change Phone Number
                                </button>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-6 mt-2">
                    <p className="text-sm text-muted-foreground">
                        Vendor? <Link href="/paperbox/admin" className="text-primary hover:underline">Partner Login</Link>
                    </p>
                </CardFooter>
            </Card>
        </Section>
    )
}
