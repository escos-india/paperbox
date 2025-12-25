"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { productsAPI } from "@/lib/api" // Import API
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { Badge } from "@/components/ui/badge"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { Loader2, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Define Product Type to match API response
interface Product {
    _id: string
    name: string
    brand: string
    category: string
    condition: string
    price: number
    quantity: number
    images: string[]
    specifications: Record<string, string> | Map<string, string> // Specs can be object or Map
    vendorId: {
        _id: string
        businessName: string
    }
}

export default function CatalogPage() {
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
    const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "")

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true)
            try {
                const params: any = {}
                if (searchQuery) params.search = searchQuery
                if (categoryFilter && categoryFilter !== "all") params.category = categoryFilter

                const res = await productsAPI.getAll(params)
                setProducts(res.data.data)
            } catch (error) {
                console.error("Failed to fetch products", error)
            } finally {
                setIsLoading(false)
            }
        }

        // Debounce search slightly to avoid too many requests
        const timeoutId = setTimeout(() => {
            fetchProducts()
        }, 300)

        return () => clearTimeout(timeoutId)
    }, [searchQuery, categoryFilter])

    // Render specs helper (handles both Map and Object)
    const renderSpecs = (specs: any) => {
        if (!specs) return null
        const entries = specs instanceof Map ? Array.from(specs.entries()) : Object.entries(specs)

        return entries.slice(0, 3).map(([key, value]: any) => (
            <div key={key} className="flex justify-between border-b pb-1 last:border-0 text-sm">
                <span className="text-muted-foreground capitalize">{key}</span>
                <span className="font-medium truncate ml-2">{value}</span>
            </div>
        ))
    }

    return (
        <Section className="bg-background min-h-screen">
            <div className="container mx-auto">
                <div className="text-center max-w-3xl mx-auto mb-8">
                    <h1 className="text-4xl font-bold mb-4">Hardware Catalog</h1>
                    <p className="text-lg text-muted-foreground">
                        Enterprise-grade infrastructure equipment available for immediate deployment.
                    </p>
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="electronics">Electronics</option>
                        <option value="laptops">Laptops</option>
                        <option value="servers">Servers</option>
                        <option value="networking">Networking</option>
                        <option value="phones">Phones</option>
                        <option value="accessories">Accessories</option>
                    </select>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-lg">
                        <h3 className="text-xl font-semibold mb-2">No products found</h3>
                        <p className="text-muted-foreground">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                        {products.map((product, index) => (
                            <ScrollReveal key={product._id} delay={index * 0.05}>
                                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden group">
                                    <div className="aspect-video bg-muted relative overflow-hidden">
                                        {product.images && product.images.length > 0 ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary/20">
                                                No Image
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 flex gap-2">
                                            <Badge variant={product.condition === 'new' ? 'default' : 'secondary'} className="capitalize">
                                                {product.condition}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">{product.brand}</p>
                                                <CardTitle className="text-lg line-clamp-1" title={product.name}>{product.name}</CardTitle>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1 pb-4">
                                        <div className="space-y-2">
                                            {renderSpecs(product.specifications)}
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex items-center justify-between border-t pt-4 bg-muted/5">
                                        <div>
                                            <div className="text-xl font-bold text-primary">₹{product.price.toLocaleString()}</div>
                                            <p className="text-xs text-muted-foreground">
                                                By {product.vendorId?.businessName || 'Paperbox Partner'}
                                            </p>
                                        </div>
                                        <Link href={`/catalog/${product._id}`}>
                                            <Button size="sm">View Details</Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </div>
        </Section>
    )
}
