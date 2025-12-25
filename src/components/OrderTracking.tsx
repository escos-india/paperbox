import { CheckCircle2, Circle, Package, Truck, Home, MapPin, AlertCircle, ShoppingBag, XCircle, RotateCcw } from "lucide-react"

interface OrderTrackingProps {
    status: string
    currentStep?: number // Optional override
}

const ORDER_STEPS = [
    { id: 'placed', label: 'Order Placed', icon: ShoppingBag },
    { id: 'accepted', label: 'Accepted', icon: CheckCircle2 },
    { id: 'picked_packed', label: 'Packed', icon: Package },
    { id: 'shipped', label: 'Shipped', icon: Truck },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
    { id: 'delivered', label: 'Delivered', icon: Home },
]

export function OrderTracking({ status }: OrderTrackingProps) {
    if (status === 'cancelled') {
        return (
            <div className="flex items-center gap-2 text-red-600 p-4 bg-red-50 rounded-md border-2 border-red-200">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Order Cancelled</span>
            </div>
        )
    }

    if (status === 'returned') {
        return (
            <div className="flex items-center gap-2 text-amber-600 p-4 bg-amber-50 rounded-md border-2 border-amber-200">
                <RotateCcw className="h-5 w-5" />
                <span className="font-medium">Refund Requested - Order Returned</span>
            </div>
        )
    }

    // Find current step index
    const currentStepIndex = ORDER_STEPS.findIndex(step => step.id === status)
    // If status not found (e.g. 'confirmed' which is mapped to 'accepted' conceptually or legacy), default to 0
    const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0

    return (
        <div className="w-full py-6">
            <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-6 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
                <div
                    className="absolute top-6 left-0 h-1 bg-gradient-to-r from-green-500 to-primary -z-10 -translate-y-1/2 transition-all duration-700 ease-in-out"
                    style={{ width: `${(activeIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
                ></div>

                {ORDER_STEPS.map((step, index) => {
                    const Icon = step.icon
                    const isCompleted = index < activeIndex
                    const isCurrent = index === activeIndex
                    const isPending = index > activeIndex

                    return (
                        <div key={step.id} className="flex flex-col items-center bg-background px-2">
                            <div
                                className={`
                                    flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                                    ${isCompleted ? 'border-green-500 bg-green-500 text-white scale-100' : ''}
                                    ${isCurrent ? 'border-green-600 bg-green-600 text-white scale-110 ring-4 ring-green-500/30 animate-pulse' : ''}
                                    ${isPending ? 'border-gray-300 text-gray-400 bg-white scale-90' : ''}
                                `}
                            >
                                <Icon className={`${isCurrent ? 'h-6 w-6' : 'h-5 w-5'}`} />
                            </div>
                            <span className={`
                                text-xs mt-2 font-medium transition-all duration-300 text-center
                                ${isCompleted ? 'text-green-600' : ''}
                                ${isCurrent ? 'text-green-600 font-bold' : ''}
                                ${isPending ? 'text-gray-400' : ''}
                            `}>
                                {step.label}
                            </span>
                            {isCurrent && (
                                <span className="text-[10px] text-green-600 mt-1">● Active</span>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
