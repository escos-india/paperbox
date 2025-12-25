"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { ordersAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { Loader2, ArrowLeft, Package, CreditCard, ShieldCheck, XCircle } from "lucide-react"
import { OrderTracking } from "@/components/OrderTracking"
import Image from "next/image"
import toast from "react-hot-toast"
import Link from "next/link"

function OrderDetailsContent() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isCancelling, setIsCancelling] = useState(false)
    const [isRequestingRefund, setIsRequestingRefund] = useState(false)

    useEffect(() => {
        if (params.id) {
            fetchOrder(params.id as string)
        }
    }, [params.id])

    const fetchOrder = async (id: string) => {
        try {
            const res = await ordersAPI.getById(id)
            setOrder(res.data.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load order details")
            // router.push("/paperbox/buyer/orders")
        } finally {
            setIsLoading(false)
        }
    }

    const handleCancelOrder = async () => {
        if (!order) return

        const confirmed = window.confirm("Are you sure you want to cancel this order? This action cannot be undone.")
        if (!confirmed) return

        setIsCancelling(true)
        try {
            await ordersAPI.cancelOrder(order._id)
            toast.success("Order cancelled successfully")
            // Refresh order data
            await fetchOrder(order._id)
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || "Failed to cancel order")
        } finally {
            setIsCancelling(false)
        }
    }

    const handleRefundRequest = async () => {
        if (!order) return

        const reason = window.prompt("Please provide a reason for the refund request:")
        if (!reason || reason.trim() === "") {
            toast.error("Refund reason is required")
            return
        }

        setIsRequestingRefund(true)
        try {
            await ordersAPI.requestRefund(order._id, reason)
            toast.success("Refund request submitted successfully")
            // Refresh order data
            await fetchOrder(order._id)
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || "Failed to request refund")
        } finally {
            setIsRequestingRefund(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <p>Order not found</p>
                <Button variant="link" onClick={() => router.push("/paperbox/buyer/orders")}>
                    Back to Orders
                </Button>
            </div>
        )
    }

    const canPay = order.status === 'delivered' && order.paymentId?.status === 'pending'
    const canCancel = ['placed', 'accepted', 'picked_packed'].includes(order.status)
    const canRefund = order.status === 'delivered' && order.paymentId?.status !== 'pending'

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild className="pl-0 gap-2 mb-4">
                    <Link href="/paperbox/buyer/orders">
                        <ArrowLeft className="h-4 w-4" /> Back to Orders
                    </Link>
                </Button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">Order #{order.orderId}</h1>
                        <p className="text-muted-foreground mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                        <p className="text-2xl font-bold">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                </div>
                {canCancel && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleCancelOrder}
                        disabled={isCancelling}
                    >
                        {isCancelling ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelling...
                            </>
                        ) : (
                            <>
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Order
                            </>
                        )}
                    </Button>
                )}
            </div>

            {/* Tracking Section */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <OrderTracking status={order.status} />

                    {/* Delivery OTP Section */}
                    {order.status === 'out_for_delivery' && (
                        <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h4 className="font-semibold text-primary">Delivery OTP</h4>
                                <p className="text-sm text-muted-foreground">Share this OTP with the delivery agent only after receiving your package.</p>
                            </div>
                            <div className="text-3xl font-mono font-bold tracking-widest bg-background px-4 py-2 rounded border">
                                {order.deliveryOtp || "****"}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Items List */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Items</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {order.items.map((item: any, i: number) => (
                                <div key={i} className="flex gap-4">
                                    <div className="relative h-24 w-24 rounded border bg-muted flex-shrink-0 overflow-hidden">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                                        <p className="font-medium mt-1">₹{item.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Pending Payment Card (Mock) */}
                    {canPay && (
                        <Card className="border-green-200 bg-green-50">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-green-700">
                                    <CreditCard className="h-5 w-5" /> Payment Pending
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-green-800 mb-4">
                                    Your order has been delivered! Please complete the payment now.
                                </p>
                                <Button className="w-full bg-green-600 hover:bg-green-700">
                                    Pay Now (Mock)
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar Details */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Shipping Address</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-1">
                            <p className="font-medium">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                            <p className="mt-2 text-muted-foreground">Phone: {order.shippingAddress.phone}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mb-2">
                                <ShieldCheck className={`h-4 w-4 ${order.paymentId?.status === 'success' ? 'text-green-600' : 'text-amber-600'}`} />
                                <span className="font-medium capitalize">{order.paymentId?.status || "Pending"}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Method: Pay on Delivery</p>
                        </CardContent>
                        {canRefund && (
                            <CardFooter className="pt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-amber-600 text-amber-600 hover:bg-amber-50 w-full"
                                    onClick={handleRefundRequest}
                                    disabled={isRequestingRefund}
                                >
                                    {isRequestingRefund ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Requesting...
                                        </>
                                    ) : (
                                        "Request Refund"
                                    )}
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function OrderDetailsPage() {
    return (
        <Section className="min-h-screen bg-muted/10">
            <Suspense fallback={<div>Loading...</div>}>
                <OrderDetailsContent />
            </Suspense>
        </Section>
    )
}
