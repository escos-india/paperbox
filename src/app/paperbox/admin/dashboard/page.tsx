"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { vendorAPI, adminAPI } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Package, ShoppingBag, DollarSign, Plus, AlertCircle, CheckCircle, Users, Store, CreditCard, LogOut } from "lucide-react"
import toast from "react-hot-toast"
import Link from 'next/link'

function AdminDashboard({ user }: { user: any }) {
    const [stats, setStats] = useState<any>(null)
    const [pendingVendors, setPendingVendors] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [analyticsRes, vendorsRes] = await Promise.all([
                    adminAPI.getAnalytics(),
                    adminAPI.getPendingVendors()
                ])
                setStats(analyticsRes.data.data)
                setPendingVendors(vendorsRes.data.data)
            } catch (error) {
                console.error(error)
                // toast.error("Failed to load admin data")
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    if (isLoading) {
        return <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">System Overview</p>
                </div>
                <div className="flex gap-2">
                    <Button asChild variant="outline">
                        <Link href="/paperbox/admin/users">
                            <Users className="mr-2 h-4 w-4" /> Manage Users
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/paperbox/admin/subscriptions/manage">
                            <CreditCard className="mr-2 h-4 w-4" /> Manage Plans
                        </Link>
                    </Button>
                    <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50" size="icon" title="Logout">
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                        <p className="text-xs text-muted-foreground">Buyers and Vendors</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                        <Store className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalVendors || 0}</div>
                        <p className="text-xs text-muted-foreground">{pendingVendors.length} pending approval</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats?.totalRevenue?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">From subscriptions & commissions</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="pending" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="pending">Pending Vendors</TabsTrigger>
                    {/* <TabsTrigger value="overview">System Health</TabsTrigger> */}
                </TabsList>

                <TabsContent value="pending" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Pending Vendor Approvals</CardTitle>
                            <CardDescription>Review and approve new vendor registrations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {pendingVendors.length === 0 ? (
                                    <p className="text-muted-foreground py-4">No pending approvals</p>
                                ) : (
                                    pendingVendors.map((vendor) => (
                                        <div key={vendor._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                            <div>
                                                <p className="font-semibold">{vendor.businessName}</p>
                                                <p className="text-sm text-muted-foreground">{vendor.name} • {vendor.phone}</p>
                                                <p className="text-xs text-muted-foreground">{vendor.email}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => {
                                                    toast.promise(adminAPI.approveVendor(vendor._id), {
                                                        loading: 'Approving...',
                                                        success: 'Vendor approved!',
                                                        error: 'Failed to approve'
                                                    }).then(() => setPendingVendors(prev => prev.filter(v => v._id !== vendor._id)))
                                                }}>
                                                    Approve
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => {
                                                    toast.promise(adminAPI.rejectVendor(vendor._id), {
                                                        loading: 'Rejecting...',
                                                        success: 'Vendor rejected',
                                                        error: 'Failed to reject'
                                                    }).then(() => setPendingVendors(prev => prev.filter(v => v._id !== vendor._id)))
                                                }}>
                                                    Reject
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

function VendorDashboard({ user }: { user: any }) {
    const [stats, setStats] = useState<any>(null)
    const [products, setProducts] = useState<any[]>([])
    const [orders, setOrders] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { logout } = useAuth()
    const router = useRouter()

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [earningsRes, productsRes, ordersRes] = await Promise.all([
                    vendorAPI.getEarnings(),
                    vendorAPI.getProducts({ limit: 5 }),
                    vendorAPI.getOrders({ limit: 5 })
                ])

                setStats(earningsRes.data.data)
                setProducts(productsRes.data.data)
                setOrders(ordersRes.data.data)
            } catch (error) {
                console.error(error)
                // toast.error("Failed to load dashboard data")
            } finally {
                setIsLoading(false)
            }
        }
        fetchDashboardData()
    }, [])

    if (isLoading) {
        return <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {user?.businessName || user?.name}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50" size="icon" title="Logout">
                        <LogOut className="h-5 w-5" />
                    </Button>
                    <div className="h-6 w-px bg-border mx-2" />
                    <Button asChild variant="outline">
                        <Link href="/paperbox/admin/subscription">
                            <CreditCard className="mr-2 h-4 w-4" /> Manage Subscription
                        </Link>
                    </Button>
                    <Button asChild variant="outline">
                        <Link href="/paperbox/vendor/orders">
                            <ShoppingBag className="mr-2 h-4 w-4" /> View Orders
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/paperbox/admin/products/new">
                            <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Link>
                    </Button>
                </div>
            </div>

            {user?.status === 'pending' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3 text-yellow-800">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <div>
                        <p className="font-semibold">Account Pending Approval</p>
                        <p className="text-sm">Your vendor account is currently under review by the admin. You can add products, but they won't be visible to buyers until approved.</p>
                    </div>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{stats?.totalEarnings?.toLocaleString() || 0}</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
                        <p className="text-xs text-muted-foreground">{stats?.pendingOrders || 0} pending processing</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{products.length}</div>
                        <p className="text-xs text-muted-foreground">In stock and listed</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Account Status</CardTitle>
                        <CheckCircle className={`h-4 w-4 ${user?.status === 'approved' ? 'text-green-500' : 'text-yellow-500'}`} />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold capitalize">{user?.status || 'Pending'}</div>
                        <p className="text-xs text-muted-foreground">
                            {user?.status === 'approved' ? 'Verified Vendor' : 'Awaiting verification'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="products">Recent Products</TabsTrigger>
                    <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Recent Orders</CardTitle>
                                <CardDescription>You have {stats?.pendingOrders || 0} orders requiring attention.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {orders.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-8">No orders yet</p>
                                    ) : (
                                        orders.map((order) => (
                                            <div key={order._id} className="flex items-center">
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">Order #{order.orderId}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium">₹{order.totalAmount.toLocaleString()}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Top Products</CardTitle>
                                <CardDescription>Your best performing items this month.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-8">
                                    {products.length === 0 ? (
                                        <p className="text-muted-foreground text-center py-8">No products listed</p>
                                    ) : (
                                        products.slice(0, 5).map((product) => (
                                            <div key={product._id} className="flex items-center">
                                                <div className="ml-4 space-y-1">
                                                    <p className="text-sm font-medium leading-none">{product.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {product.soldCount || 0} sold
                                                    </p>
                                                </div>
                                                <div className="ml-auto font-medium">₹{product.price.toLocaleString()}</div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default function DashboardPage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/paperbox/admin")
            } else if (user.role !== 'vendor' && user.role !== 'admin') {
                router.push("/login")
            }
        }
    }, [user, authLoading, router])

    if (authLoading || !user) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <Section className="py-8">
            {user.role === 'admin' ? (
                <AdminDashboard user={user} />
            ) : (
                <VendorDashboard user={user} />
            )}
        </Section>
    )
}
