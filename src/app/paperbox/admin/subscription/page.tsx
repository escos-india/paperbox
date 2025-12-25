"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { vendorAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, AlertCircle } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"

declare global {
    interface Window {
        Razorpay: any
    }
}

export default function SubscriptionPage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()

    const [plans, setPlans] = useState<any[]>([])
    const [currentSubscription, setCurrentSubscription] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [processingPlanId, setProcessingPlanId] = useState<string | null>(null)

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'vendor')) {
            router.push('/login')
            return
        }

        const loadData = async () => {
            try {
                const [plansRes, subRes] = await Promise.all([
                    vendorAPI.getSubscriptionPlans(),
                    vendorAPI.getSubscription()
                ])
                setPlans(plansRes.data.data)
                setCurrentSubscription(subRes.data.data)
            } catch (error) {
                console.error(error)
                toast.error("Failed to load subscription details")
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            loadData()
            // Load Razorpay Script
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.async = true
            document.body.appendChild(script)
            return () => {
                document.body.removeChild(script)
            }
        }
    }, [user, authLoading, router])

    const handleSubscribe = async (plan: any) => {
        setProcessingPlanId(plan._id)
        try {
            // 1. Create Order
            const { data } = await vendorAPI.subscribe(plan._id)

            if (!data.success) throw new Error(data.message)

            const options = {
                key: data.order.keyId,
                amount: data.order.amount,
                currency: data.order.currency,
                name: "Paperbox",
                description: `Subscription for ${plan.name} Plan`,
                order_id: data.order.id,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await vendorAPI.verifySubscription({
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                            planId: plan._id
                        })

                        if (verifyRes.data.success) {
                            toast.success("Subscription activated successfully!")
                            // Refresh data
                            const subRes = await vendorAPI.getSubscription()
                            setCurrentSubscription(subRes.data.data)
                        } else {
                            toast.error("Verification failed")
                        }
                    } catch (err) {
                        toast.error("Payment verification failed")
                        console.error(err)
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone
                },
                theme: {
                    color: "#3b82f6"
                }
            }

            const rzp = new window.Razorpay(options)
            rzp.open()
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || "Failed to initiate subscription")
        } finally {
            setProcessingPlanId(null)
        }
    }

    if (loading || authLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <Section className="py-8 min-h-screen bg-gray-50/50">
            <div className="container max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
                        <p className="text-muted-foreground mt-2">
                            Choose a plan that fits your business needs. Upgrade or renew anytime.
                        </p>
                    </div>
                    <Link href="/paperbox/admin/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>

                {currentSubscription && (
                    <div className="mb-10 bg-white p-6 rounded-lg border shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-lg">Current Plan</h3>
                                <Badge variant={currentSubscription.status === 'active' ? 'default' : 'destructive'}>
                                    {currentSubscription.status.toUpperCase()}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground">
                                You are currently subscribed to the <span className="font-medium text-foreground">{currentSubscription.planId?.name}</span> plan.
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Expires on: {new Date(currentSubscription.endDate).toLocaleDateString()}
                            </p>
                        </div>
                        {currentSubscription.status === 'active' && (
                            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium">
                                <Check className="h-4 w-4" /> Active & Valid
                            </div>
                        )}
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan) => {
                        const isCurrent = currentSubscription?.planId?._id === plan._id && currentSubscription.status === 'active'

                        return (
                            <Card key={plan._id} className={`flex flex-col relative ${isCurrent ? 'border-primary shadow-md ring-1 ring-primary' : ''}`}>
                                {isCurrent && (
                                    <div className="absolute top-0 transform -translate-y-1/2 left-1/2 -translate-x-1/2">
                                        <Badge>Current Plan</Badge>
                                    </div>
                                )}
                                <CardHeader>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description || "Perfect for growing businesses"}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold">₹{plan.price.toLocaleString()}</span>
                                        <span className="text-muted-foreground">/{plan.duration} days</span>
                                    </div>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>List up to <strong>{plan.maxProducts}</strong> products</span>
                                        </li>
                                        {plan.features && plan.features.map((feature: string, i: number) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <Check className="h-4 w-4 text-green-500" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={isCurrent ? "outline" : "default"}
                                        disabled={isCurrent || processingPlanId === plan._id}
                                        onClick={() => handleSubscribe(plan)}
                                    >
                                        {processingPlanId === plan._id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isCurrent ? "Active Plan" : "Subscribe Now"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>

                <div className="mt-12 p-4 rounded-lg bg-blue-50 text-blue-800 flex gap-3 items-start">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-semibold">Secure Payments by Razorpay</h4>
                        <p className="text-sm mt-1">
                            Your payment is securely processed. We do not store your card details.
                            Subscription activates immediately after successful payment.
                        </p>
                    </div>
                </div>
            </div>
        </Section>
    )
}
