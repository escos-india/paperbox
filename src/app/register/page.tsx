"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { authAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { OTPInput } from "@/components/ui/otp-input"
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react"
import toast from "react-hot-toast"

export default function RegisterPage() {
    const router = useRouter()
    const { sendOTP } = useAuth()

    const [step, setStep] = useState<'PHONE' | 'OTP_DETAILS'>('PHONE')
    const [isLoading, setIsLoading] = useState(false)
    const [devOtp, setDevOtp] = useState("")

    // Form State
    const [phone, setPhone] = useState("")
    const [otp, setOtp] = useState("")
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        businessName: "",
        gstNumber: "",
        razorpayKeyId: "",
        razorpayKeySecret: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India"
    })

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
            setStep('OTP_DETAILS')
            if (result.devOtp) {
                setDevOtp(result.devOtp)
                setOtp(result.devOtp) // Auto-fill for convenience in dev
                toast.success(`Dev Mode OTP: ${result.devOtp}`, { duration: 5000 })
            } else {
                toast.success("OTP sent. Please verify to continue.")
            }
        } else {
            toast.error(result.message || "Failed to send OTP")
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()

        if (otp.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP")
            return
        }

        if (!formData.name || !formData.businessName || !formData.city || !formData.state) {
            toast.error("Please fill in all required fields")
            return
        }

        setIsLoading(true)
        try {
            const payload = {
                phone,
                otp,
                name: formData.name,
                email: formData.email,
                password: formData.password,
                businessName: formData.businessName,
                gstNumber: formData.gstNumber,
                razorpayKeyId: formData.razorpayKeyId,
                razorpayKeySecret: formData.razorpayKeySecret,
                address: {
                    street: formData.street,
                    city: formData.city,
                    state: formData.state,
                    pincode: formData.pincode,
                    country: formData.country
                }
            }

            // Call API directly since context usually handles login/verify only
            await authAPI.vendorSignup(payload)

            toast.success("Registration successful! Waiting for Admin Approval.")
            // Redirect to Login page after successful registration
            setTimeout(() => router.push("/login"), 2000)

        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || "Registration failed")
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <Section className="min-h-[80vh] flex items-center justify-center bg-muted/30 py-12">
            <Card className="w-full max-w-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Vendor Registration</CardTitle>
                    <CardDescription>Join Paperbox to sell your products</CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 'PHONE' ? (
                        <form onSubmit={handleSendOTP} className="space-y-6 max-w-sm mx-auto">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Mobile Number</label>
                                <div className="flex gap-2">
                                    <span className="flex items-center justify-center w-12 border rounded-md bg-muted text-muted-foreground">+91</span>
                                    <input
                                        type="tel"
                                        className="flex-1 p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                        placeholder="98765 43210"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Send Verification OTP
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleRegister} className="space-y-6">
                            {/* OTP Section */}
                            <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mb-6">
                                <label className="block text-sm font-medium mb-3 text-center">Verify OTP sent to +91 {phone}</label>
                                <div className="flex justify-center mb-2">
                                    <OTPInput length={6} value={otp} onChange={setOtp} disabled={isLoading} />
                                </div>
                                {devOtp && (
                                    <p className="text-xs text-center text-muted-foreground mt-2">Dev OTP: {devOtp}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Personal Info */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Full Name *</label>
                                    <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email *</label>
                                    <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password *</label>
                                    <input name="password" type="password" value={formData.password} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="Min 6 characters" required />
                                </div>

                                {/* Business Info */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Business Name *</label>
                                    <input name="businessName" value={formData.businessName} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">GST Number </label>
                                    <input name="gstNumber" value={formData.gstNumber} required onChange={handleChange} className="w-full p-2 border rounded-md" />
                                </div>

                                {/* Address */}
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm font-medium">Street Address</label>
                                    <input name="street" value={formData.street} onChange={handleChange} className="w-full p-2 border rounded-md" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">City *</label>
                                    <input name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">State *</label>
                                    <input name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Pincode *</label>
                                    <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <h4 className="text-sm font-semibold mb-4">Payment Configuration (Razorpay)</h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Key ID</label>
                                        <input name="razorpayKeyId" required value={formData.razorpayKeyId} onChange={handleChange} className="w-full p-2 border rounded-md" placeholder="rzp_live_..." />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Key Secret</label>
                                        <input name="razorpayKeySecret" required type="password" value={formData.razorpayKeySecret} onChange={handleChange} className="w-full p-2 border rounded-md" />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Complete Registration"}
                            </Button>
                        </form>
                    )}
                </CardContent>
                <CardFooter className="flex justify-center flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <Link href="/login" className="text-primary hover:underline">Login</Link>
                    </p>
                    {step !== 'PHONE' && (
                        <button onClick={() => setStep('PHONE')} className="text-xs text-muted-foreground hover:underline">
                            Change Phone Number
                        </button>
                    )}
                </CardFooter>
            </Card>
        </Section >
    )
}
