"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useStore, Product, ProductCondition, ProductAvailability } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, X, Upload, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ProductFormProps {
    initialData?: Product
    isEdit?: boolean
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
    const router = useRouter()
    const { addProduct, updateProduct } = useStore()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        brand: "",
        category: "Laptop",
        condition: "New",
        price: 0,
        availability: "In Stock",
        reasonForSelling: "",
        specs: {},
        images: []
    })

    const [specKey, setSpecKey] = useState("")
    const [specValue, setSpecValue] = useState("")

    useEffect(() => {
        if (initialData) {
            setFormData(initialData)
        }
    }, [initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        const productData = {
            ...formData,
            id: initialData?.id || crypto.randomUUID(),
            images: formData.images?.length ? formData.images : ["/placeholder-product.jpg"]
        } as Product

        if (isEdit) {
            updateProduct(productData)
        } else {
            addProduct(productData)
        }

        router.push("/paperbox/admin/dashboard")
    }

    const addSpec = () => {
        if (specKey && specValue) {
            setFormData(prev => ({
                ...prev,
                specs: { ...prev.specs, [specKey]: specValue }
            }))
            setSpecKey("")
            setSpecValue("")
        }
    }

    const removeSpec = (key: string) => {
        const newSpecs = { ...formData.specs }
        delete newSpecs[key]
        setFormData(prev => ({ ...prev, specs: newSpecs }))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        images: [...(prev.images || []), reader.result as string]
                    }))
                }
                reader.readAsDataURL(file)
            })
        }
    }

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto pb-12">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/paperbox/admin/dashboard">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">{isEdit ? "Edit Product" : "Add New Product"}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Core Details */}
                <div className="lg:col-span-2 space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Core Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Product Name</label>
                                <input
                                    className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="e.g. Dell Latitude 7440"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Brand</label>
                                    <input
                                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={formData.brand}
                                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                        required
                                        placeholder="e.g. Dell"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Category</label>
                                    <select
                                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Laptop</option>
                                        <option>Desktop</option>
                                        <option>Server</option>
                                        <option>Networking</option>
                                        <option>Peripheral</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Condition</label>
                                    <select
                                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={formData.condition}
                                        onChange={e => setFormData({ ...formData, condition: e.target.value as ProductCondition })}
                                    >
                                        <option>New</option>
                                        <option>Refurbished</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Availability</label>
                                    <select
                                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={formData.availability}
                                        onChange={e => setFormData({ ...formData, availability: e.target.value as ProductAvailability })}
                                    >
                                        <option>In Stock</option>
                                        <option>Limited Stock</option>
                                        <option>Out of Stock</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price (₹)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                    required
                                    min="0"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Reason for Selling</label>
                                <textarea
                                    className="w-full p-2 border rounded-md bg-background min-h-[100px] focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    value={formData.reasonForSelling}
                                    onChange={e => setFormData({ ...formData, reasonForSelling: e.target.value })}
                                    required
                                    placeholder="Why is this product being sold?"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Technical Specifications</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col sm:flex-row gap-4 items-end">
                                <div className="w-full sm:flex-1 space-y-2">
                                    <label className="text-sm font-medium">Spec Name</label>
                                    <input
                                        placeholder="e.g. Processor"
                                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={specKey}
                                        onChange={e => setSpecKey(e.target.value)}
                                    />
                                </div>
                                <div className="w-full sm:flex-1 space-y-2">
                                    <label className="text-sm font-medium">Value</label>
                                    <input
                                        placeholder="e.g. Intel Core i7"
                                        className="w-full p-2 border rounded-md bg-background focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        value={specValue}
                                        onChange={e => setSpecValue(e.target.value)}
                                    />
                                </div>
                                <Button type="button" onClick={addSpec} variant="secondary" className="w-full sm:w-auto mb-[2px]">
                                    <Plus className="h-4 w-4 mr-2" /> Add
                                </Button>
                            </div>

                            <div className="border rounded-md divide-y">
                                {Object.entries(formData.specs || {}).length === 0 && (
                                    <div className="p-4 text-center text-sm text-muted-foreground">
                                        No specifications added yet.
                                    </div>
                                )}
                                {Object.entries(formData.specs || {}).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors">
                                        <div className="grid grid-cols-2 gap-4 flex-1">
                                            <span className="font-medium text-sm">{key}</span>
                                            <span className="text-sm text-muted-foreground">{value}</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSpec(key)}
                                            className="text-muted-foreground hover:text-destructive"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Media & Actions */}
                <div className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Images</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                {formData.images?.map((img, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border group">
                                        <Image
                                            src={img}
                                            alt={`Product ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors bg-muted/20 hover:bg-muted/40"
                                >
                                    <Upload className="h-6 w-6 mb-2" />
                                    <span className="text-xs font-medium">Upload Image</span>
                                </button>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                            />
                            <p className="text-xs text-muted-foreground text-center">
                                Supported formats: JPG, PNG, WebP
                            </p>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-4 sticky top-24">
                        <Button type="submit" size="lg" className="w-full">
                            {isEdit ? "Save Changes" : "Create Product"}
                        </Button>
                        <Link href="/paperbox/admin/dashboard" className="w-full">
                            <Button type="button" variant="outline" className="w-full">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    )
}
