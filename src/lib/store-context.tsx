"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

// Types
export type ProductCondition = "New" | "Refurbished"
export type ProductAvailability = "In Stock" | "Limited Stock" | "Out of Stock"

export interface Product {
    id: string
    name: string
    brand: string
    category: string
    condition: ProductCondition
    reasonForSelling?: string
    price: number
    availability: ProductAvailability
    specs: Record<string, string>
    images: string[]
}

export interface User {
    name: string
    email: string
    organization: string
    role: string
    location: string
    status: "Active" | "Inactive"
}

interface StoreContextType {
    products: Product[]
    addProduct: (product: Product) => void
    updateProduct: (product: Product) => void
    deleteProduct: (id: string) => void

    user: User | null
    loginUser: () => void
    logoutUser: () => void

    isAdmin: boolean
    loginAdmin: () => void
    logoutAdmin: () => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

// Dummy Data
const INITIAL_PRODUCTS: Product[] = [
    {
        id: "1",
        name: "Dell PowerEdge R750 Server",
        brand: "Dell",
        category: "Server",
        condition: "Refurbished",
        price: 450000,
        availability: "In Stock",
        reasonForSelling: "Data center consolidation surplus.",
        specs: {
            "Processor": "2x Intel Xeon Gold 6330",
            "RAM": "128GB DDR4 ECC",
            "Storage": "2x 960GB SSD SAS",
            "Form Factor": "2U Rack"
        },
        images: ["/images/products/server.png"]
    },
    {
        id: "2",
        name: "Cisco Catalyst 9300 Switch",
        brand: "Cisco",
        category: "Networking",
        condition: "New",
        price: 185000,
        availability: "Limited Stock",
        reasonForSelling: "Overstock inventory.",
        specs: {
            "Ports": "48x 1G PoE+",
            "Uplink": "4x 10G SFP+",
            "Layer": "Layer 3",
            "Stackable": "Yes"
        },
        images: ["/images/products/switch.png"]
    },
    {
        id: "3",
        name: "HP EliteBook 840 G8",
        brand: "HP",
        category: "Laptop",
        condition: "Refurbished",
        price: 65000,
        availability: "In Stock",
        reasonForSelling: "Corporate lease return.",
        specs: {
            "Processor": "Intel Core i7-1165G7",
            "RAM": "16GB DDR4",
            "Storage": "512GB NVMe SSD",
            "Display": "14-inch FHD IPS"
        },
        images: ["/images/products/laptop.png"]
    },
    {
        id: "4",
        name: "Fortinet FortiGate 60F",
        brand: "Fortinet",
        category: "Networking",
        condition: "New",
        price: 42000,
        availability: "In Stock",
        reasonForSelling: "New sealed box unit.",
        specs: {
            "Throughput": "10 Gbps",
            "VPN": "6.5 Gbps",
            "Ports": "10x GE RJ45",
            "Form Factor": "Desktop"
        },
        images: ["/images/products/firewall.png"]
    }
]

const DUMMY_USER: User = {
    name: "Example Corporate User",
    email: "user@company.com",
    organization: "Example Pvt Ltd",
    role: "IT Manager",
    location: "India",
    status: "Active"
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)
    const [user, setUser] = useState<User | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)

    // Load from local storage on mount (optional, for persistence across reloads)
    useEffect(() => {
        const storedProducts = localStorage.getItem("paperbox_products")
        if (storedProducts) {
            setProducts(JSON.parse(storedProducts))
        }

        const storedUser = localStorage.getItem("paperbox_user")
        if (storedUser) setUser(JSON.parse(storedUser))

        const storedAdmin = localStorage.getItem("paperbox_admin")
        if (storedAdmin) setIsAdmin(JSON.parse(storedAdmin))
    }, [])

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem("paperbox_products", JSON.stringify(products))
    }, [products])

    useEffect(() => {
        if (user) localStorage.setItem("paperbox_user", JSON.stringify(user))
        else localStorage.removeItem("paperbox_user")
    }, [user])

    useEffect(() => {
        localStorage.setItem("paperbox_admin", JSON.stringify(isAdmin))
    }, [isAdmin])


    const addProduct = (product: Product) => {
        setProducts([...products, product])
    }

    const updateProduct = (updatedProduct: Product) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
    }

    const deleteProduct = (id: string) => {
        setProducts(products.filter(p => p.id !== id))
    }

    const loginUser = () => setUser(DUMMY_USER)
    const logoutUser = () => setUser(null)

    const loginAdmin = () => setIsAdmin(true)
    const logoutAdmin = () => setIsAdmin(false)

    return (
        <StoreContext.Provider value={{
            products,
            addProduct,
            updateProduct,
            deleteProduct,
            user,
            loginUser,
            logoutUser,
            isAdmin,
            loginAdmin,
            logoutAdmin
        }}>
            {children}
        </StoreContext.Provider>
    )
}

export function useStore() {
    const context = useContext(StoreContext)
    if (context === undefined) {
        throw new Error("useStore must be used within a StoreProvider")
    }
    return context
}
