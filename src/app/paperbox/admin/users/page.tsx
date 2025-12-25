"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { adminAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Section } from "@/components/ui/section"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, Filter, MoreVertical, ShieldAlert, CheckCircle, Ban } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import toast from "react-hot-toast"
import Link from "next/link"

export default function AdminUsersPage() {
    const { user, isAdmin, isLoading: authLoading } = useAuth()
    const router = useRouter()

    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [roleFilter, setRoleFilter] = useState<string>("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const params: any = { page, limit: 10 }
            if (searchQuery) params.search = searchQuery
            if (roleFilter && roleFilter !== "all") params.role = roleFilter

            const res = await adminAPI.getUsers(params)
            setUsers(res.data.data)
            setTotalPages(res.data.pagination.pages)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                router.push('/login')
                return
            }
            fetchUsers()
        }
    }, [user, authLoading, page, roleFilter])

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (page !== 1) setPage(1)
            else fetchUsers()
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    const handleStatusChange = async (userId: string, newStatus: string) => {
        try {
            await adminAPI.updateUserStatus(userId, newStatus)
            toast.success(`User ${newStatus === 'blocked' ? 'blocked' : 'activated'} successfully`)
            // Update local state
            setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u))
        } catch (error) {
            console.error(error)
            toast.error("Failed to update user status")
        }
    }

    if (authLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <Section className="py-8 min-h-screen bg-gray-50/50">
            <div className="container mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                        <p className="text-muted-foreground mt-2">
                            View and manage all buyers and vendors on the platform.
                        </p>
                    </div>
                    <Link href="/paperbox/admin/dashboard">
                        <Button variant="outline">Back to Dashboard</Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <CardTitle className="text-xl">Users Directory</CardTitle>
                            <div className="flex gap-2">
                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search name, email..."
                                        className="pl-8"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <select
                                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                >
                                    <option value="">All Roles</option>
                                    <option value="vendor">Vendor</option>
                                    <option value="buyer">Buyer</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                            </TableCell>
                                        </TableRow>
                                    ) : users.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                No users found matching your filters.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        users.map((user) => (
                                            <TableRow key={user._id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{user.businessName || user.name}</div>
                                                        <div className="text-xs text-muted-foreground">{user.email}</div>
                                                        {user.phone && <div className="text-xs text-muted-foreground">{user.phone}</div>}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">
                                                        {user.role}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={
                                                        user.status === 'approved' || user.status === 'active'
                                                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                            : user.status === 'blocked'
                                                                ? 'bg-red-100 text-red-800 hover:bg-red-100'
                                                                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                                                    }>
                                                        {user.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            {user.status !== 'blocked' ? (
                                                                <DropdownMenuItem
                                                                    className="text-red-600 focus:text-red-600"
                                                                    onClick={() => handleStatusChange(user._id, 'blocked')}
                                                                >
                                                                    <Ban className="mr-2 h-4 w-4" /> Block User
                                                                </DropdownMenuItem>
                                                            ) : (
                                                                <DropdownMenuItem
                                                                    className="text-green-600 focus:text-green-600"
                                                                    onClick={() => handleStatusChange(user._id, user.role === 'vendor' ? 'approved' : 'active')}
                                                                >
                                                                    <CheckCircle className="mr-2 h-4 w-4" /> Unblock User
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-end space-x-2 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1 || loading}
                                >
                                    Previous
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    Page {page} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages || loading}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Section>
    )
}
