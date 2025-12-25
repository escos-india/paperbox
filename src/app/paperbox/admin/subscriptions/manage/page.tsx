"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { adminAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Trash2, Edit, X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import toast from "react-hot-toast"
import Link from "next/link"

export default function ManagePlansPage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()

    const [plans, setPlans] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingPlan, setEditingPlan] = useState<any>(null)

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        duration: "30",
        maxProducts: "50",
        description: "",
        featuresString: "" // Comma separated for simplicity in UI
    })

    const fetchPlans = async () => {
        setLoading(true)
        try {
            const res = await adminAPI.getSubscriptionPlans()
            setPlans(res.data.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load plans")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                router.push('/login')
                return
            }
            fetchPlans()
        }
    }, [user, authLoading])

    const handleOpenCreate = () => {
        setEditingPlan(null)
        setFormData({
            name: "",
            price: "",
            duration: "30",
            maxProducts: "50",
            description: "",
            featuresString: ""
        })
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (plan: any) => {
        setEditingPlan(plan)
        setFormData({
            name: plan.name,
            price: plan.price.toString(),
            duration: plan.duration.toString(),
            maxProducts: plan.maxProducts.toString(),
            description: plan.description || "",
            featuresString: plan.features ? plan.features.join(", ") : ""
        })
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const payload = {
                name: formData.name,
                price: parseFloat(formData.price),
                duration: parseInt(formData.duration),
                maxProducts: parseInt(formData.maxProducts),
                description: formData.description,
                features: formData.featuresString.split(",").map(s => s.trim()).filter(Boolean)
            }

            if (editingPlan) {
                await adminAPI.updateSubscriptionPlan(editingPlan._id, payload)
                toast.success("Plan updated successfully")
            } else {
                await adminAPI.createSubscriptionPlan(payload)
                toast.success("Plan created successfully")
            }

            setIsDialogOpen(false)
            fetchPlans()
        } catch (error) {
            console.error(error)
            toast.error("Failed to save plan")
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this plan? This action cannot be undone.")) return

        try {
            await adminAPI.deleteSubscriptionPlan(id)
            toast.success("Plan deleted")
            fetchPlans()
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete plan")
        }
    }

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <Section className="py-8 min-h-screen bg-gray-50/50">
            <div className="container mx-auto max-w-5xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
                        <p className="text-muted-foreground mt-2">
                            Manage subscription tiers available to vendors.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/paperbox/admin/dashboard">
                            <Button variant="outline">Back to Dashboard</Button>
                        </Link>
                        <Button onClick={handleOpenCreate}>
                            <Plus className="mr-2 h-4 w-4" /> Create Plan
                        </Button>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                        <Card key={plan._id} className="relative group">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleOpenEdit(plan)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDelete(plan._id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-xl flex justify-between">
                                    {plan.name}
                                </CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold">₹{plan.price}</span>
                                    <span className="text-muted-foreground">/{plan.duration} days</span>
                                </div>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <p>Max. {plan.maxProducts} Products</p>
                                    <div className="flex flex-wrap gap-1">
                                        {plan.features?.map((f: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="text-xs">{f}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {plans.length === 0 && (
                        <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed">
                            <p className="text-muted-foreground mb-4">No subscription plans created yet.</p>
                            <Button variant="outline" onClick={handleOpenCreate}>Create Your First Plan</Button>
                        </div>
                    )}
                </div>

                {/* Create/Edit Dialog */}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingPlan ? 'Edit Plan' : 'Create New Plan'}</DialogTitle>
                            <DialogDescription>
                                Set the pricing and features for this subscription tier.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Plan Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Gold"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (₹)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        placeholder="999"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration (Days)</Label>
                                    <Input
                                        id="duration"
                                        type="number"
                                        min="1"
                                        value={formData.duration}
                                        onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="maxProducts">Max Products</Label>
                                    <Input
                                        id="maxProducts"
                                        type="number"
                                        min="1"
                                        value={formData.maxProducts}
                                        onChange={e => setFormData({ ...formData, maxProducts: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Short Description</Label>
                                <Input
                                    id="description"
                                    placeholder="Best for small sellers..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="features">Features (Comma separated)</Label>
                                <Textarea
                                    id="features"
                                    placeholder="Priority Support, Featured Listings, Analytics..."
                                    value={formData.featuresString}
                                    onChange={e => setFormData({ ...formData, featuresString: e.target.value })}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit">{editingPlan ? 'Update Plan' : 'Create Plan'}</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </Section>
    )
}
