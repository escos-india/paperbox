"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { productsAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Define Product Interface based on Backend Response
interface Product {
    _id: string
    name: string
    brand: string
    category: string
    condition: string
    price: number
    quantity: number
    reasonForSelling?: string
    description?: string
    images: string[]
    specifications: Record<string, string> | Map<string, string>
    vendorId: {
        _id: string
        businessName: string
    }
}

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()

    const [product, setProduct] = useState<Product | undefined>(undefined)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [selectedImage, setSelectedImage] = useState<string>("")

    useEffect(() => {
        const fetchProduct = async () => {
            if (!params.id) return

            try {
                setLoading(true)
                const res = await productsAPI.getById(params.id as string)
                if (res.data.success) {
                    setProduct(res.data.data)
                    if (res.data.data.images && res.data.data.images.length > 0) {
                        setSelectedImage(res.data.data.images[0])
                    }
                } else {
                    setError("Product not found")
                }
            } catch (err: any) {
                console.error("Error fetching product:", err)
                setError("Failed to load product details")
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-destructive font-medium">{error || "Product not found"}</p>
                <Link href="/catalog">
                    <Button variant="outline">Back to Catalog</Button>
                </Link>
            </div>
        )
    }

    const handlePurchase = () => {
        if (user) {
            router.push("/checkout?productId=" + product._id)
        } else {
            router.push("/register")
        }
    }

    // Derive availability from quantity
    const availabilityStatus = product.quantity > 5 ? 'In Stock' : product.quantity > 0 ? 'Limited Stock' : 'Out of Stock'
    const availabilityColor = product.quantity > 5 ? 'bg-green-100 text-green-800' : product.quantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'

    const renderSpecs = (specs: any) => {
        if (!specs) return null
        const entries = specs instanceof Map ? Array.from(specs.entries()) : Object.entries(specs)

        return entries.map(([key, value]: any) => (
            <div key={key} className="flex flex-col border-b pb-2 last:border-0 sm:last:border-b">
                <span className="text-sm text-muted-foreground capitalize">{key}</span>
                <span className="font-medium">{value}</span>
            </div>
        ))
    }

    return (
        <Section className="min-h-screen bg-background">
            <div className="container mx-auto">
                <Link href="/catalog" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Catalog
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-muted rounded-xl relative overflow-hidden border">
                            {selectedImage ? (
                                <Image
                                    src={selectedImage}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    No Image Available
                                </div>
                            )}
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedImage(img)}
                                        className={`aspect-square bg-muted rounded-lg border relative overflow-hidden ${selectedImage === img ? 'ring-2 ring-primary' : ''}`}
                                    >
                                        <Image src={img} alt={`Thumb ${i}`} fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <div className="mb-2">
                            <span className="text-primary font-medium">{product.brand || 'Generic'}</span>
                            <span className="mx-2 text-muted-foreground">•</span>
                            <span className="text-muted-foreground capitalize">{product.category}</span>
                            <span className="mx-2 text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                                Sold by {product.vendorId?.businessName || 'Paperbox Vendor'}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="text-3xl font-bold">₹{product.price.toLocaleString()}</div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${availabilityColor}`}>
                                {availabilityStatus}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${product.condition.toLowerCase() === 'new' ? 'border-primary text-primary' : 'border-muted-foreground text-muted-foreground'
                                } capitalize`}>
                                {product.condition}
                            </div>
                        </div>

                        {product.reasonForSelling && (
                            <div className="prose prose-neutral max-w-none mb-8">
                                <h3 className="text-lg font-semibold mb-2">Reason for Selling</h3>
                                <p className="text-muted-foreground">{product.reasonForSelling}</p>
                            </div>
                        )}

                        {product.description && (
                            <div className="prose prose-neutral max-w-none mb-8">
                                <h3 className="text-lg font-semibold mb-2">Description</h3>
                                <p className="text-muted-foreground">{product.description}</p>
                            </div>
                        )}

                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                    {renderSpecs(product.specifications)}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex flex-col gap-4">
                            <Button
                                size="lg"
                                className="w-full text-lg h-14"
                                onClick={handlePurchase}
                                disabled={product.quantity <= 0}
                            >
                                {product.quantity <= 0 ? "Out of Stock" : user ? "Proceed to Purchase" : "Register to Purchase"}
                            </Button>
                            {!user && (
                                <p className="text-sm text-center text-muted-foreground">
                                    Existing user? <Link href="/login" className="text-primary hover:underline">Login here</Link>
                                </p>
                            )}

                            <div className="flex items-center justify-center gap-6 mt-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" /> Verified Quality
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" /> 7-Day Return Policy
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    )
}
