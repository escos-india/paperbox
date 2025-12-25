"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { User, Building, MapPin, Briefcase, LogOut, Package } from "lucide-react"

export default function ProfilePage() {
    const { user, logout, isLoading: authLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login")
        }
    }, [user, authLoading, router])

    if (authLoading || !user) return null

    return (
        <Section className="bg-muted/10 min-h-[80vh]">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => router.push("/paperbox/buyer/orders")}>
                            <Package className="h-4 w-4 mr-2" /> My Orders
                        </Button>
                        <Button variant="destructive" onClick={() => {
                            logout()
                            router.push("/login")
                        }}>
                            <LogOut className="h-4 w-4 mr-2" /> Logout
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-1">
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <User className="h-12 w-12 text-primary" />
                            </div>
                            <h2 className="text-xl font-semibold mb-1">{user.name || "User"}</h2>
                            <p className="text-sm text-muted-foreground mb-4 capitalize">{user.role}</p>
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                                {user.status || "active"}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{user.phone}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium">{user.email || "N/A"}</p>
                                    </div>
                                </div>
                                {user.role === 'vendor' && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-muted-foreground">Business Name</label>
                                            <div className="flex items-center gap-2">
                                                <Building className="h-4 w-4 text-muted-foreground" />
                                                <p className="font-medium">{user.businessName}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                        <p className="font-medium capitalize">{user.role}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Section>
    )
}
