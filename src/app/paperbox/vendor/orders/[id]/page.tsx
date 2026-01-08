"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { vendorAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft, Package, User, MapPin } from "lucide-react"
import { OrderTracking } from "@/components/OrderTracking"
import Image from "next/image"
import toast from "react-hot-toast"
import Link from "next/link"

const ORDER_STATUSES = [
    { value: 'placed', label: 'Order Placed' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'picked_packed', label: 'Packed' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'out_for_delivery', label: 'Out for Delivery' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'returned', label: 'Returned' }
]

function VendorOrderDetailsContent() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isUpdating, setIsUpdating] = useState(false)
    const [isGeneratingOTP, setIsGeneratingOTP] = useState(false)

    useEffect(() => {
        if (params.id) {
            fetchOrder(params.id as string)
        }
    }, [params.id])

    const fetchOrder = async (id: string) => {
        try {
            const res = await vendorAPI.getVendorOrderById(id)
            console.log('Order fetched, current status:', res.data.data.status)
            setOrder(res.data.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load order details")
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusUpdate = async (newStatus: string) => {
        if (!order) return

        setIsUpdating(true)
        try {
            await vendorAPI.updateOrderStatus(order._id, { status: newStatus })
            toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`)
            // Refresh order data
            await fetchOrder(order._id)
        } catch (error) {
            console.error(error)
            toast.error("Failed to update order status")
        } finally {
            setIsUpdating(false)
        }
    }

    const handleGenerateOTP = async () => {
        if (!order) return

        setIsGeneratingOTP(true)
        try {
            const res = await vendorAPI.generateDeliveryOTP(order._id)
            toast.success("Delivery OTP generated")
            // Refresh order to show OTP
            await fetchOrder(order._id)
        } catch (error: any) {
            console.error(error)
            toast.error(error.response?.data?.message || "Failed to generate OTP")
        } finally {
            setIsGeneratingOTP(false)
        }
    }

    const handleMarkDelivered = async () => {
        if (!order) return

        const confirmed = window.confirm("Mark this order as delivered? This action will update the order status.")
        if (!confirmed) return

        await handleStatusUpdate('delivered')
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
                <Button variant="link" onClick={() => router.push("/paperbox/vendor/orders")}>
                    Back to Orders
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto py-8">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild className="pl-0 gap-2 mb-4">
                    <Link href="/paperbox/vendor/orders">
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
            </div>

            {/* Status Update Card */}
            <Card className="mb-6 border-primary/20 bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-lg">Update Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="text-sm font-medium mb-2 block">Current Status</label>
                            <Select
                                value={order.status}
                                onValueChange={handleStatusUpdate}
                                disabled={isUpdating}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ORDER_STATUSES.map((status) => (
                                        <SelectItem key={status.value} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {isUpdating && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Updating...
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Order Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                    <OrderTracking key={order.status} status={order.status} />

                    {/* Delivery OTP Section */}
                    {order.status === 'out_for_delivery' && (
                        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                            <h4 className="font-semibold text-primary mb-2">Delivery Verification</h4>
                            {order.deliveryOtp ? (
                                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Delivery OTP (Share with customer)</p>
                                        <div className="text-3xl font-mono font-bold tracking-widest bg-background px-4 py-2 rounded border mt-2">
                                            {order.deliveryOtp}
                                        </div>
                                    </div>
                                    <Button onClick={handleMarkDelivered} disabled={isUpdating}>
                                        {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                        Mark as Delivered
                                    </Button>
                                </div>
                            ) : (
                                <Button onClick={handleGenerateOTP} disabled={isGeneratingOTP}>
                                    {isGeneratingOTP ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        "Generate Delivery OTP"
                                    )}
                                </Button>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment Verification Section */}
            {
                (!order.isPaymentVerified && order.transactionId) && (
                    <Card className="mb-8 border-amber-200 bg-amber-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-amber-700">
                                Payment Verification Needed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                                <div>
                                    <p className="font-medium text-amber-900">Buyer submitted payment details:</p>
                                    <p className="mt-1">Transaction ID: <span className="font-mono font-bold bg-white px-2 py-0.5 rounded border">{order.transactionId}</span></p>
                                    {order.paymentProof && (
                                        <a href={order.paymentProof} target="_blank" rel="noreferrer" className="text-sm text-blue-600 underline mt-1 block">View Payment Proof</a>
                                    )}
                                </div>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={async () => {
                                        if (!window.confirm("Verify this payment? This will confirm the order.")) return;
                                        try {
                                            await vendorAPI.verifyPayment(order._id);
                                            toast.success("Payment Verified!");
                                            fetchOrder(order._id);
                                        } catch (e) {
                                            toast.error("Failed to verify payment");
                                        }
                                    }}
                                >
                                    Verify Payment
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )
            }

            {/* Refund Request Section */}
            {
                (order.refundRequested) && (
                    <Card className="mb-8 border-red-200 bg-red-50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-red-700">
                                Refund Request
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <p className="font-medium text-red-900">Reason:</p>
                                <p className="bg-white p-3 rounded border border-red-100 mt-1">{order.refundReason}</p>
                                <p className="text-sm mt-2">Status: <span className="font-bold">{order.refundStatus || 'PENDING'}</span></p>
                            </div>

                            {order.refundStatus === 'PENDING' && (
                                <div className="flex gap-4">
                                    <Button
                                        variant="default"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={async () => {
                                            const note = window.prompt("Approve Note (optional):");
                                            try {
                                                await vendorAPI.refundDecision(order._id, { status: 'APPROVED', note: note || undefined });
                                                toast.success("Refund Approved");
                                                fetchOrder(order._id);
                                            } catch (e) {
                                                toast.error("Failed to approve refund");
                                            }
                                        }}
                                    >
                                        Approve Refund
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={async () => {
                                            const note = window.prompt("Rejection Reason (optional):");
                                            try {
                                                await vendorAPI.refundDecision(order._id, { status: 'REJECTED', note: note || undefined });
                                                toast.success("Refund Rejected");
                                                fetchOrder(order._id);
                                            } catch (e) {
                                                toast.error("Failed to reject refund");
                                            }
                                        }}
                                    >
                                        Reject Refund
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            }


            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Items</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {order.items.map((item: any, i: number) => (
                                <div key={i} className="flex gap-4">
                                    <div className="relative h-24 w-24 rounded border bg-muted flex-shrink-0 overflow-hidden">
                                        {item.image ? (
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                                <Package className="h-8 w-8" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold">{item.name}</h4>
                                        <p className="text-sm text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                                        <p className="font-medium mt-2">₹{item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>₹{order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax (18% GST)</span>
                                    <span>₹{order.tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total</span>
                                    <span>₹{order.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <div>
                                <p className="text-muted-foreground">Name</p>
                                <p className="font-medium">{order.buyerId?.name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Phone</p>
                                <p className="font-medium">{order.buyerId?.phone || 'N/A'}</p>
                            </div>
                            {order.buyerId?.email && (
                                <div>
                                    <p className="text-muted-foreground">Email</p>
                                    <p className="font-medium text-xs">{order.buyerId.email}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Shipping Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-1">
                            <p className="font-medium">{order.shippingAddress.name}</p>
                            <p>{order.shippingAddress.street}</p>
                            <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                            <p>{order.shippingAddress.pincode}</p>
                            <p className="mt-2 text-muted-foreground">Phone: {order.shippingAddress.phone}</p>
                        </CardContent>
                    </Card>

                    {/* Payment Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 text-sm">
                                <p className="text-muted-foreground">Method</p>
                                <p className="font-medium">{order.isManual ? "Manual / QR" : "Online"}</p>
                                <p className="text-muted-foreground mt-2">Status</p>
                                <p className={`font-medium capitalize ${order.isPaymentVerified ? 'text-green-600' : 'text-amber-600'}`}>
                                    {order.isPaymentVerified ? "Paid" : (order.transactionId ? "Verification Pending" : "Payment Pending")}
                                </p>
                                {order.transactionId && <p className="text-xs text-muted-foreground mt-1">Ref: {order.transactionId}</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default function VendorOrderDetailsPage() {
    return (
        <Section className="min-h-screen bg-muted/10">
            <Suspense fallback={<div>Loading...</div>}>
                <VendorOrderDetailsContent />
            </Suspense>
        </Section>
    )
}
