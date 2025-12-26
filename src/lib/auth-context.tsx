"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import api, { authAPI } from "./api"

// Types
export interface User {
    _id: string
    name: string
    email?: string
    phone: string
    role: 'admin' | 'vendor' | 'buyer'
    status: 'pending' | 'approved' | 'blocked'
    businessName?: string
    gstNumber?: string
    address?: {
        street: string
        city: string
        state: string
        pincode: string
        country: string
    }
    totalEarnings?: number
    avatar?: string
    createdAt: string
    updatedAt: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    isAuthenticated: boolean
    isAdmin: boolean
    isVendor: boolean
    isBuyer: boolean

    // Auth methods
    sendOTP: (identifier: string) => Promise<{ success: boolean; devOtp?: string; message?: string }>
    verifyOTP: (identifier: string, otp: string, name?: string) => Promise<{ success: boolean; isNewUser?: boolean; user?: User; message?: string }>
    vendorLogin: (email: string, password: string) => Promise<{ success: boolean; user?: User; message?: string }>
    adminLoginInit: (email: string, password: string, secretKey: string) => Promise<{ success: boolean; message?: string; phone?: string }>
    adminLoginVerify: (email: string, otp: string) => Promise<{ success: boolean; user?: User; message?: string }>
    vendorForgotPasswordInit: (identifier: string) => Promise<{ success: boolean; message?: string; phone?: string; devOtp?: string }>
    vendorForgotPasswordReset: (identifier: string, otp: string, newPassword: string) => Promise<{ success: boolean; message?: string }>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load user from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('paperbox_token')
        const storedUser = localStorage.getItem('paperbox_user')

        if (storedToken && storedUser) {
            setToken(storedToken)
            try {
                setUser(JSON.parse(storedUser))
            } catch (e) {
                // Invalid stored user, clear
                localStorage.removeItem('paperbox_user')
            }
        }
        setIsLoading(false)
    }, [])

    // Sync to localStorage immediately and in background
    useEffect(() => {
        if (token) {
            localStorage.setItem('paperbox_token', token)
        } else {
            localStorage.removeItem('paperbox_token')
        }
    }, [token])

    useEffect(() => {
        if (user) {
            localStorage.setItem('paperbox_user', JSON.stringify(user))
        } else {
            localStorage.removeItem('paperbox_user')
        }
    }, [user])

    // Storage event listener to sync across tabs
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'paperbox_token') {
                setToken(e.newValue)
                if (!e.newValue) setUser(null)
            }
            if (e.key === 'paperbox_user') {
                setUser(e.newValue ? JSON.parse(e.newValue) : null)
            }
        }
        window.addEventListener('storage', handleStorageChange)
        return () => window.removeEventListener('storage', handleStorageChange)
    }, [])

    // Send OTP
    const sendOTP = useCallback(async (identifier: string) => {
        try {
            const response = await authAPI.sendOTP(identifier)
            return {
                success: true,
                devOtp: response.data.devOtp,
                message: response.data.message
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to send OTP'
            }
        }
    }, [])

    // Verify OTP
    const verifyOTP = useCallback(async (identifier: string, otp: string, name?: string) => {
        try {
            const response = await authAPI.verifyOTP(identifier, otp, name)
            const { token: newToken, user: newUser, isNewUser } = response.data

            setToken(newToken)
            setUser(newUser)

            // Immediate sync for subsequent API calls
            localStorage.setItem('paperbox_token', newToken)
            localStorage.setItem('paperbox_user', JSON.stringify(newUser))

            return {
                success: true,
                isNewUser,
                user: newUser,
                message: response.data.message
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to verify OTP'
            }
        }
    }, [])

    // Vendor Login (Email/Password)
    const vendorLogin = useCallback(async (email: string, password: string) => {
        try {
            const response = await authAPI.vendorLogin(email, password)
            const { token: newToken, user: newUser } = response.data

            setToken(newToken)
            setUser(newUser)

            // Immediate sync
            localStorage.setItem('paperbox_token', newToken)
            localStorage.setItem('paperbox_user', JSON.stringify(newUser))

            return {
                success: true,
                user: newUser,
                message: response.data.message
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Invalid credentials'
            }
        }
    }, [])

    // Admin Login Step 1: Init (Send OTP)
    const adminLoginInit = useCallback(async (email: string, password: string, secretKey: string) => {
        try {
            console.log("AuthContext Calling API:", { email, password, secretKey }) // DEBUG
            const response = await authAPI.adminLoginInit({ email, password, secretKey })
            return {
                success: true,
                message: response.data.message,
                phone: response.data.phone
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Invalid credentials'
            }
        }
    }, [])

    // Admin Login Step 2: Verify OTP
    const adminLoginVerify = useCallback(async (email: string, otp: string) => {
        try {
            const response = await authAPI.adminLoginVerify({ email, otp })
            const { token: newToken, user: newUser } = response.data

            setToken(newToken)
            setUser(newUser)

            // Immediate sync
            localStorage.setItem('paperbox_token', newToken)
            localStorage.setItem('paperbox_user', JSON.stringify(newUser))

            return {
                success: true,
                user: newUser,
                message: response.data.message
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Invalid OTP'
            }
        }
    }, [])

    // Vendor Forgot Password Init
    const vendorForgotPasswordInit = useCallback(async (identifier: string) => {
        try {
            const response = await authAPI.vendorForgotPasswordInit(identifier)
            return {
                success: true,
                message: response.data.message,
                phone: response.data.phone,
                devOtp: response.data.devOtp
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Vendor not found'
            }
        }
    }, [])

    // Vendor Forgot Password Reset
    const vendorForgotPasswordReset = useCallback(async (identifier: string, otp: string, newPassword: string) => {
        try {
            const response = await authAPI.vendorForgotPasswordReset({ identifier, otp, newPassword })
            return {
                success: true,
                message: response.data.message
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to reset password'
            }
        }
    }, [])

    // Logout
    const logout = useCallback(async () => {
        try {
            if (token) {
                await authAPI.logout()
            }
        } catch (error) {
            console.error('Logout failed:', error)
        } finally {
            setToken(null)
            setUser(null)
            localStorage.removeItem('paperbox_token')
            localStorage.removeItem('paperbox_user')
        }
    }, [token])

    // Refresh user data
    const refreshUser = useCallback(async () => {
        if (!token) return

        try {
            const response = await authAPI.getProfile()
            setUser(response.data.user)
        } catch (error) {
            // Token might be invalid
            logout()
        }
    }, [token, logout])

    // Axios Interceptor for 401s
    useEffect(() => {
        const interceptor = api.interceptors.response.use(
            (response: any) => response,
            (error: any) => {
                if (error.response?.status === 401) {
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => api.interceptors.response.eject(interceptor);
    }, [logout]);

    const value: AuthContextType = React.useMemo(() => ({
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        isAdmin: user?.role === 'admin',
        isVendor: user?.role === 'vendor',
        isBuyer: user?.role === 'buyer',
        sendOTP,
        verifyOTP,
        vendorLogin,
        adminLoginInit,
        adminLoginVerify,
        vendorForgotPasswordInit,
        vendorForgotPasswordReset,
        logout,
        refreshUser
    }), [
        user, token, isLoading,
        sendOTP, verifyOTP, vendorLogin,
        adminLoginInit, adminLoginVerify,
        vendorForgotPasswordInit, vendorForgotPasswordReset,
        logout, refreshUser
    ])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
