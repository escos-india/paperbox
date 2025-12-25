"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { ordersAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Package, Truck, CheckCircle2, Clock, XCircle } from "lucide-react"
import toast from "react-hot-toast"
import Link from "next/link"
import Image from "next/image"

export default function BuyerOrdersPage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/login")
            } else {
                fetchOrders()
            }
        }
    }, [user, authLoading, router])

    const fetchOrders = async () => {
        try {
            const res = await ordersAPI.getAll()
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
            case 'delivered': return <CheckCircle2 className="text-green-500" />
            case 'cancelled': return <XCircle className="text-red-500" />
            case 'shipped': return <Truck className="text-blue-500" />
            default: return <Clock className="text-orange-500" />
        }
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
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">My Orders</h1>

                {orders.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Package className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No orders yet</h3>
                            <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                            <Button asChild>
                                <Link href="/catalog">Start Shopping</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <Card key={order.orderId}>
                                <CardHeader className="bg-muted/10 border-b py-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex gap-4">
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Order Placed</span>
                                                <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Total</span>
                                                <span className="font-medium">₹{order.totalAmount.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground block text-xs">Order ID</span>
                                                <span className="font-medium">{order.orderId}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(order.status)}
                                            <span className="font-medium capitalize">{order.status}</span>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {order.items.map((item: any, i: number) => (
                                        <div key={i} className="flex gap-4 mb-4 last:mb-0">
                                            <div className="relative h-20 w-20 rounded border bg-muted flex-shrink-0 overflow-hidden">
                                                {item.image ? (
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No Image</div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold line-clamp-1">{item.name}</h4>
                                                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                <p className="font-medium mt-1">₹{item.price.toLocaleString()}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/paperbox/buyer/orders/${order._id}`}>Track Order</Link>
                                                </Button>
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/checkout?productId=${item.productId}`}>Buy Again</Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </Section>
    )
}
