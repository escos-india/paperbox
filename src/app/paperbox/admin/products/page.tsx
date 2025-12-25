"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { vendorAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { Loader2, Plus, Edit, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import toast from "react-hot-toast"
import Link from 'next/link'
import Image from 'next/image'

export default function VendorProductsPage() {
    const { user, isVendor, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [products, setProducts] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/paperbox/admin")
            } else {
                fetchProducts()
            }
        }
    }, [user, authLoading, router])

    const fetchProducts = async () => {
        try {
            const res = await vendorAPI.getProducts()
            setProducts(res.data.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load products")
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return

        try {
            await vendorAPI.deleteProduct(id)
            setProducts(products.filter(p => p._id !== id))
            toast.success("Product deleted successfully")
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete product")
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
        <Section className="py-8">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Your Products</h1>
                        <p className="text-muted-foreground">
                            Manage your product catalog
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/paperbox/admin/products/new">
                            <Plus className="mr-2 h-4 w-4" /> Add Product
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {products.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-lg">
                            No products found. Add your first product to get started.
                        </div>
                    ) : (
                        products.map((product) => (
                            <Card key={product._id} className="overflow-hidden">
                                <div className="aspect-video relative bg-muted">
                                    {product.images?.[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-muted-foreground">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="font-semibold truncate">{product.name}</h3>
                                    <div className="flex items-center justify-between mt-2 mb-4">
                                        <span className="font-bold">₹{product.price.toLocaleString()}</span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {product.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="flex-1" asChild>
                                            <Link href={`/paperbox/admin/products/edit/${product._id}`}>
                                                <Edit className="h-4 w-4 mr-2" /> Edit
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-9 w-9"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </Section>
    )
}
