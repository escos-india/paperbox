"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { vendorAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Package, CheckCircle2, Clock, XCircle, Truck } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"
import Image from "next/image"

export default function VendorOrdersPage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<string>("all")

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'vendor') {
                router.push("/login")
            } else {
                fetchOrders()
            }
        }
    }, [user, authLoading, router, filter])

    const fetchOrders = async () => {
        try {
            const params = filter !== "all" ? { status: filter } : {}
            const res = await vendorAPI.getVendorOrders(params)
            setOrders(res.data.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load orders")
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'delivered': return <CheckCircle2 className="text-green-500 h-5 w-5" />
            case 'cancelled': return <XCircle className="text-red-500 h-5 w-5" />
            case 'shipped':
            case 'out_for_delivery': return <Truck className="text-blue-500 h-5 w-5" />
            default: return <Clock className="text-orange-500 h-5 w-5" />
        }
    }

    const getStatusBadge = (status: string) => {
        const colors: Record<string, string> = {
            placed: "bg-gray-100 text-gray-800",
            accepted: "bg-blue-100 text-blue-800",
            picked_packed: "bg-purple-100 text-purple-800",
            shipped: "bg-indigo-100 text-indigo-800",
            out_for_delivery: "bg-cyan-100 text-cyan-800",
            delivered: "bg-green-100 text-green-800",
            cancelled: "bg-red-100 text-red-800",
            returned: "bg-amber-100 text-amber-800"
        }
        const label = status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || colors.placed}`}>
                {label}
            </span>
        )
    }

    if (authLoading || isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <Section className="py-8 min-h-[80vh]">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">My Orders</h1>
                    <div className="flex gap-2">
                        <Button
                            variant={filter === "all" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("all")}
                        >
                            All
                        </Button>
                        <Button
                            variant={filter === "placed" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("placed")}
                        >
                            New
                        </Button>
                        <Button
                            variant={filter === "shipped" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("shipped")}
                        >
                            Shipped
                        </Button>
                        <Button
                            variant={filter === "delivered" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter("delivered")}
                        >
                            Delivered
                        </Button>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Package className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No orders found</h3>
                            <p className="text-muted-foreground">You haven't received any orders yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Card key={order._id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="bg-muted/10 border-b py-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex gap-6">
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Order ID</span>
                                                <span className="font-medium">{order.orderId}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Order Date</span>
                                                <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Customer</span>
                                                <span className="font-medium">{order.buyerId?.name || 'N/A'}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Total</span>
                                                <span className="font-medium">₹{order.totalAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {getStatusBadge(order.status)}
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/paperbox/vendor/orders/${order._id}`}>Manage</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="flex gap-4">
                                        {order.items.slice(0, 3).map((item: any, i: number) => (
                                            <div key={i} className="flex gap-3 items-center">
                                                <div className="relative h-16 w-16 rounded border bg-muted flex-shrink-0 overflow-hidden">
                                                    {item.image ? (
                                                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No Image</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <div className="flex items-center text-sm text-muted-foreground">
                                                +{order.items.length - 3} more
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Section>
    )
}
