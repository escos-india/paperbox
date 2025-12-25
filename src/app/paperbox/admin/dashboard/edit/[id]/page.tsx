"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useStore, Product } from "@/lib/store-context"
import { ProductForm } from "../../product-form"

export default function EditProductPage() {
    const params = useParams()
    const router = useRouter()
    const { products } = useStore()
    const [product, setProduct] = useState<Product | undefined>(undefined)

    useEffect(() => {
        const found = products.find(p => p.id === params.id)
        if (found) {
            setProduct(found)
        } else {
            router.push("/paperbox/admin/dashboard")
        }
    }, [params.id, products, router])

    if (!product) return null

    return (
        <div className="min-h-screen bg-muted/10 p-6">
            <ProductForm initialData={product} isEdit />
        </div>
    )
}
