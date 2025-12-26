import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('paperbox_token') : null;
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - clear and redirect
            if (typeof window !== 'undefined') {
                localStorage.removeItem('paperbox_token');
                localStorage.removeItem('paperbox_user');
                // Optionally redirect to login
                // window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// ==================== AUTH API ====================
export const authAPI = {
    sendOTP: (identifier: string) => api.post('/auth/send-otp', { identifier }),
    verifyOTP: (identifier: string, otp: string, name?: string) => api.post('/auth/verify-otp', { identifier, otp, name }),

    vendorSignup: (data: {
        phone: string;
        otp: string;
        name: string;
        email?: string;
        password?: string;
        businessName: string;
        gstNumber?: string;
        razorpayKeyId?: string;
        razorpayKeySecret?: string;
    }) => api.post('/auth/vendor/signup', data),

    vendorLogin: (email: string, password: string) =>
        api.post('/auth/vendor/login', { email, password }),

    adminLoginInit: (data: { email: string; password: string; secretKey: string }) =>
        api.post('/auth/admin/login-init', data),

    adminLoginVerify: (data: { email: string; otp: string }) =>
        api.post('/auth/admin/login-verify', data),

    getProfile: () =>
        api.get('/auth/me'),

    updateProfile: (data: { name?: string; email?: string; address?: object }) =>
        api.put('/auth/profile', data),

    vendorForgotPasswordInit: (identifier: string) =>
        api.post('/auth/vendor/forgot-password/init', { identifier }),

    vendorForgotPasswordReset: (data: { identifier: string; otp: string; newPassword: string }) =>
        api.post('/auth/vendor/forgot-password/reset', data),

    logout: () =>
        api.post('/auth/logout'),
};

// ==================== PRODUCTS API ====================
export const productsAPI = {
    getAll: (params?: {
        category?: string;
        condition?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
        sort?: string;
        page?: number;
        limit?: number;
    }) => api.get('/products', { params }),

    getFeatured: () =>
        api.get('/products/featured'),

    getCategories: () =>
        api.get('/products/categories'),

    getById: (id: string) =>
        api.get(`/products/${id}`),
};

// ==================== ORDERS API (Buyer) ====================
export const ordersAPI = {
    checkout: (data: {
        items: Array<{ productId: string; quantity: number }>;
        shippingAddress: {
            name: string;
            phone: string;
            street: string;
            city: string;
            state: string;
            pincode: string;
        };
    }) => api.post('/checkout', data),

    verifyPayment: (data: {
        orderId: string;
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
    }) => api.post('/payment/verify', data),

    getAll: (params?: { status?: string; page?: number; limit?: number }) =>
        api.get('/orders', { params }),

    getById: (id: string) =>
        api.get(`/orders/${id}`),

    verifyDelivery: (orderId: string, otp: string) =>
        api.post(`/orders/${orderId}/verify-delivery`, { otp }),

    requestRefund: (orderId: string, reason: string) =>
        api.post(`/orders/${orderId}/refund`, { reason }),

    submitFeedback: (orderId: string, data: { productId: string; rating: number; review?: string }) =>
        api.post(`/orders/${orderId}/feedback`, data),

    cancelOrder: (orderId: string, reason?: string) =>
        api.patch(`/orders/${orderId}/cancel`, { reason }),
};

// ==================== VENDOR API ====================
export const vendorAPI = {
    // Products
    getProducts: (params?: { isActive?: boolean; page?: number; limit?: number }) =>
        api.get('/vendor/products', { params }),

    createProduct: (formData: FormData) =>
        api.post('/vendor/products', formData, {
            headers: { 'Content-Type': undefined }
        }),

    updateProduct: (id: string, formData: FormData) =>
        api.put(`/vendor/products/${id}`, formData, {
            headers: { 'Content-Type': undefined }
        }),

    deleteProduct: (id: string) =>
        api.delete(`/vendor/products/${id}`),

    // Orders
    getOrders: (params?: { status?: string; page?: number; limit?: number }) =>
        api.get('/vendor/orders', { params }),

    getOrder: (id: string) =>
        api.get(`/vendor/orders/${id}`),

    // Aliases for consistency
    getVendorOrders: (params?: { status?: string; page?: number; limit?: number }) =>
        api.get('/vendor/orders', { params }),

    getVendorOrderById: (id: string) =>
        api.get(`/vendor/orders/${id}`),

    updateOrderStatus: (orderId: string, data: { status: string; note?: string }) =>
        api.patch(`/vendor/orders/${orderId}/status`, data),

    generateDeliveryOTP: (orderId: string) =>
        api.post(`/vendor/orders/${orderId}/delivery-otp`),

    // Earnings
    getEarnings: () =>
        api.get('/vendor/earnings'),

    // Subscription
    getSubscription: () =>
        api.get('/vendor/subscription'),

    getSubscriptionPlans: () =>
        api.get('/vendor/subscription/plans'),

    subscribe: (planId: string) =>
        api.post('/vendor/subscription/subscribe', { planId }),

    verifySubscription: (data: {
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
        planId: string;
    }) => api.post('/vendor/subscription/verify', data),

    // Razorpay Keys
    updateRazorpayKeys: (razorpayKeyId: string, razorpayKeySecret: string) =>
        api.put('/vendor/razorpay-keys', { razorpayKeyId, razorpayKeySecret }),
};

// ==================== ADMIN API ====================
export const adminAPI = {
    // Users
    getUsers: (params?: { role?: string; status?: string; search?: string; page?: number; limit?: number }) =>
        api.get('/admin/users', { params }),

    updateUserStatus: (userId: string, status: string) =>
        api.patch(`/admin/users/${userId}/status`, { status }),

    // Vendors
    getPendingVendors: () =>
        api.get('/admin/vendors/pending'),

    approveVendor: (vendorId: string) =>
        api.patch(`/admin/vendors/${vendorId}/approve`),

    rejectVendor: (vendorId: string, reason?: string) =>
        api.patch(`/admin/vendors/${vendorId}/reject`, { reason }),

    // Products
    getProducts: (params?: { vendorId?: string; category?: string; isActive?: boolean; page?: number; limit?: number }) =>
        api.get('/admin/products', { params }),

    deleteProduct: (productId: string) =>
        api.delete(`/admin/products/${productId}`),

    // Orders
    getOrders: (params?: { status?: string; vendorId?: string; buyerId?: string; page?: number; limit?: number }) =>
        api.get('/admin/orders', { params }),

    // Refunds
    getRefunds: (params?: { status?: string; page?: number; limit?: number }) =>
        api.get('/admin/refunds', { params }),

    processRefund: (refundId: string, data: { status: 'approved' | 'rejected'; approvedAmount?: number; adminNotes?: string }) =>
        api.patch(`/admin/refunds/${refundId}`, data),

    // Subscription Plans
    getSubscriptionPlans: () =>
        api.get('/admin/subscriptions/plans'),

    createSubscriptionPlan: (data: {
        name: string;
        price: number;
        duration: number;
        maxProducts: number;
        features?: string[];
    }) => api.post('/admin/subscriptions/plans', data),

    updateSubscriptionPlan: (planId: string, data: object) =>
        api.put(`/admin/subscriptions/plans/${planId}`, data),

    deleteSubscriptionPlan: (planId: string) =>
        api.delete(`/admin/subscriptions/plans/${planId}`),

    // Analytics
    getAnalytics: () =>
        api.get('/admin/analytics'),
};

export default api;
