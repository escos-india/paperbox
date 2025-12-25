"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { vendorAPI, productsAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/ui/section"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, X } from "lucide-react"
import toast from "react-hot-toast"
import Image from "next/image"

// Fix for Next.js 15+ useParams
// Using React.use() to unwrap params if needed, or stick to standard params prop
export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { user } = useAuth()
    const router = useRouter()

    // Unwrap params using React.use() in Next.js 15 or await it
    // But since this environment uses standard component, I'll use standard hook approach if possible or handle async params
    // Safe bet: await params in a small effect or use `use` hook if available (Next.js 13+) 
    // Actually, in client components `params` prop is just an object usually, or a promise in very new Next.js.
    // I'll assume standard page component behavior: params is passed as prop. 
    // Wait, in Next.js 15 params is async. Let's handle it safely.
    const [productId, setProductId] = useState<string>("")

    useEffect(() => {
        // Resolve params
        params.then(p => setProductId(p.id))
    }, [params])

    const [isLoading, setIsLoading] = useState(false)
    const [isFetching, setIsFetching] = useState(true)
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [existingImages, setExistingImages] = useState<string[]>([])

    // Form State
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [category, setCategory] = useState("electronics")
    const [condition, setCondition] = useState("refurbished")
    const [quantity, setQuantity] = useState("1")
    const [specs, setSpecs] = useState([{ key: "", value: "" }])

    useEffect(() => {
        if (!user) {
            router.push("/login")
            return
        }

        if (productId) {
            fetchProduct()
        }
    }, [user, productId, router])

    const fetchProduct = async () => {
        try {
            const res = await productsAPI.getById(productId)
            const product = res.data.data

            setName(product.name)
            setDescription(product.description)
            setPrice(product.price.toString())
            setCategory(product.category)
            setCondition(product.condition)
            setQuantity((product.quantity || 1).toString())

            // Handle specs - convert Map/Object to array for state
            if (product.specifications) {
                const specArray = Object.entries(product.specifications).map(([key, value]) => ({
                    key,
                    value: String(value)
                }));
                if (specArray.length > 0) {
                    setSpecs(specArray)
                }
            }

            // Handle images
            if (product.images) {
                setExistingImages(product.images)
                // We don't set previews for existing images, we render them separately or valid URLs
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to fetch product details")
            router.push("/paperbox/admin/products")
        } finally {
            setIsFetching(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files)
            setImages(prev => [...prev, ...newFiles])

            // Generate previews
            const newPreviews = newFiles.map(file => URL.createObjectURL(file))
            setPreviews(prev => [...prev, ...newPreviews])
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setPreviews(prev => prev.filter((_, i) => i !== index))
    }

    // Logic to remove existing image not implemented in API (usually needs specific endpoint or sending full list)
    // Cloudinary service usually adds images. Removing specific image might require logic.
    // For now, let's allow adding new images.

    const addSpec = () => {
        setSpecs([...specs, { key: "", value: "" }])
    }

    const updateSpec = (index: number, field: 'key' | 'value', value: string) => {
        const newSpecs = [...specs]
        newSpecs[index][field] = value
        setSpecs(newSpecs)
    }

    const removeSpec = (index: number) => {
        setSpecs(specs.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("description", description)
            formData.append("price", price)
            formData.append("category", category)
            formData.append("condition", condition)
            formData.append("quantity", quantity)
            formData.append("specifications", JSON.stringify(specs.filter(s => s.key && s.value).reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {})))

            images.forEach(image => {
                formData.append("images", image)
            })

            await vendorAPI.updateProduct(productId, formData)
            toast.success("Product updated successfully")
            router.push("/paperbox/admin/products")
        } catch (error) {
            console.error(error)
            toast.error("Failed to update product")
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <Section className="py-8 max-w-3xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Product</CardTitle>
                    <CardDescription>Update your product details</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Product Name</label>
                            <Input
                                placeholder="iPhone 13 Pro Max - 256GB"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price (₹)</label>
                                <Input
                                    type="number"
                                    placeholder="50000"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Quantity</label>
                                <Input
                                    type="number"
                                    placeholder="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="electronics">Electronics</option>
                                    <option value="laptops">Laptops</option>
                                    <option value="keyboards">Keyboards</option>
                                    <option value="accessories">Accessories</option>
                                    <option value="phones">Phones/Mobiles</option>
                                    <option value="servers">Servers</option>
                                    <option value="networking">Networking</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Condition</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={condition}
                                    onChange={(e) => setCondition(e.target.value)}
                                >
                                    <option value="new">New</option>
                                    <option value="like-new">Like New</option>
                                    <option value="refurbished">Refurbished</option>
                                    <option value="used">Used</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                placeholder="Detailed product description..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="min-h-[100px]"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-medium">Current Images</label>
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {existingImages.map((src, index) => (
                                    <div key={index} className="relative aspect-square w-24 h-24 border rounded-md overflow-hidden bg-muted flex-shrink-0">
                                        <Image src={src} alt="Existing" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>

                            <label className="text-sm font-medium">Add New Images</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {previews.map((src, index) => (
                                    <div key={index} className="relative aspect-square border rounded-md overflow-hidden bg-muted">
                                        <Image src={src} alt="Preview" fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition-colors">
                                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                                    <span className="text-xs text-muted-foreground">Upload Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium">Specifications</label>
                                <Button type="button" variant="outline" size="sm" onClick={addSpec}>Add Spec</Button>
                            </div>
                            {specs.map((spec, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        placeholder="Key (e.g., RAM)"
                                        value={spec.key}
                                        onChange={(e) => updateSpec(index, 'key', e.target.value)}
                                    />
                                    <Input
                                        placeholder="Value (e.g., 16GB)"
                                        value={spec.value}
                                        onChange={(e) => updateSpec(index, 'value', e.target.value)}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeSpec(index)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Product
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </Section>
    )
}
