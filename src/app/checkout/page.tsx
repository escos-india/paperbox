"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { productsAPI, ordersAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react"
import toast from "react-hot-toast"
import Script from "next/script"

declare global {
    interface Window {
        Razorpay: any;
    }
}

function CheckoutContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { user, isLoading: authLoading } = useAuth()
    const [product, setProduct] = useState<any>(null)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)

    // Address State
    const [shippingAddress, setShippingAddress] = useState({
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India"
    })

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                const productId = searchParams.get("productId")
                router.push(`/login?redirect=/checkout?productId=${productId}`)
                return
            }
            // Pre-fill user details
            setShippingAddress(prev => ({
                ...prev,
                name: user?.name || "",
                phone: user?.phone || ""
            }))
            fetchProduct()
        }
    }, [searchParams, user, authLoading, router])

    const fetchProduct = async () => {
        const productId = searchParams.get("productId")
        if (!productId) {
            router.push("/catalog")
            return
        }

        try {
            const res = await productsAPI.getById(productId)
            setProduct(res.data.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load product")
            router.push("/catalog")
        } finally {
            setIsLoading(false)
        }
    }

    const handleOrderConfirmation = async () => {
        if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
            toast.error("Please fill in all shipping details")
            return
        }

        setIsProcessing(true)
        try {
            // 1. Create Order (Pay on Delivery)
            const res = await ordersAPI.checkout({
                items: [{ productId: product._id, quantity: 1 }],
                shippingAddress
            })

            // 2. Success - No immediate payment
            // Capture the first order ID (assuming single vendor order for now or handle list?)
            // The API returns { orders: [...] }
            const orderId = res.data.orders[0]._id || res.data.orders[0].id;

            setIsSuccess(orderId) // Store ID instead of boolean
            toast.success("Order placed successfully!")
        } catch (error) {
            console.error(error)
            toast.error("Failed to place order")
        } finally {
            setIsProcessing(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="max-w-md mx-auto text-center py-12">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Order Placed!</h1>
                <p className="text-muted-foreground mb-8">
                    Please complete the payment to confirm your order.
                </p>
                <div className="flex gap-4 justify-center">
                    <Button onClick={() => router.push(`/paperbox/buyer/orders/${isSuccess}`)}>Complete Payment</Button>
                </div>
            </div>
        )
    }

    if (authLoading || isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!product) return null

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Name</label>
                                    <Input
                                        placeholder="John Doe"
                                        value={shippingAddress.name}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone</label>
                                    <Input
                                        placeholder="9876543210"
                                        value={shippingAddress.phone}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Street Address</label>
                                <Textarea
                                    placeholder="123 Main St, Apartment 4B"
                                    value={shippingAddress.street}
                                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">City</label>
                                    <Input
                                        placeholder="Mumbai"
                                        value={shippingAddress.city}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Pincode</label>
                                    <Input
                                        placeholder="400001"
                                        value={shippingAddress.pincode}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">State</label>
                                    <Input
                                        placeholder="Maharashtra"
                                        value={shippingAddress.state}
                                        onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Country</label>
                                    <Input value="India" disabled />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 p-4 border rounded-md bg-muted/20">
                                <ShieldCheck className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium">Pay on Delivery</p>
                                    <p className="text-sm text-muted-foreground">Confirm your order now, pay when it arrives.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-start pb-4 border-b">
                                <div>
                                    <p className="font-medium text-sm line-clamp-2">{product.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{product.condition}</p>
                                </div>
                                <p className="font-medium">₹{product.price.toLocaleString()}</p>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="font-medium">₹{product.price.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-4 border-t">
                                <span>Total</span>
                                <span>₹{product.price.toLocaleString()}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" size="lg" onClick={handleOrderConfirmation} disabled={isProcessing}>
                                {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isProcessing ? "Processing..." : "Confirm Orde"}
                            </Button>
                        </CardFooter>
                    </Card>
                    <p className="text-xs text-center text-muted-foreground mt-4">
                        By placing this order, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function CheckoutPage() {
    return (
        <Section className="min-h-screen bg-muted/10">
            {/* Razorpay script removed */}
            <Suspense fallback={<div>Loading...</div>}>
                <CheckoutContent />
            </Suspense>
        </Section>
    )
}
