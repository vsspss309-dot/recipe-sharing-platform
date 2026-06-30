import { useState, useEffect } from "react";
import { FiTrash2, FiSearch, FiFilter, FiMoreVertical, FiShield, FiUser } from "react-icons/fi";
import api from "../../utils/api";
import Spinner from "../../components/ui/Spinner";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/admin/users?page=${page}&limit=10&search=${search}&role=${roleFilter}`);
            if (response.data?.success) {
                setUsers(response.data.data);
                setTotalPages(response.data.pages);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [page, search, roleFilter]);

    const handleDelete = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
        
        try {
            const res = await api.delete(`/admin/users/${userId}`);
            if (res.data?.success) {
                setUsers(users.filter(u => u._id !== userId));
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete user");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-text-h font-heading">User Management</h2>
                    <p className="text-text/60">View and manage all registered users.</p>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
                        <select
                            value={roleFilter}
                            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                            className="bg-card border border-border rounded-xl pl-10 pr-8 py-2 text-sm appearance-none focus:outline-none focus:border-primary transition-colors cursor-pointer"
                        >
                            <option value="all">All Roles</option>
                            <option value="user">Users</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-code-bg/50 border-b border-border">
                                <th className="p-4 font-bold text-text-h text-sm">User</th>
                                <th className="p-4 font-bold text-text-h text-sm">Role</th>
                                <th className="p-4 font-bold text-text-h text-sm">Joined</th>
                                <th className="p-4 font-bold text-text-h text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center">
                                        <Spinner size="md" />
                                    </td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-text/50 italic">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user._id} className="hover:bg-code-bg/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                                                    {user.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-text-h">{user.name}</div>
                                                    <div className="text-xs text-text/60">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                                                user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'
                                            }`}>
                                                {user.role === 'admin' ? <FiShield size={12} /> : <FiUser size={12} />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-text/70">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 text-text/40 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete User"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {!isLoading && totalPages > 1 && (
                    <div className="p-4 border-t border-border flex justify-between items-center bg-code-bg/30">
                        <span className="text-sm text-text/60 font-semibold">
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className="px-4 py-2 text-sm font-bold bg-card border border-border rounded-xl hover:border-primary disabled:opacity-50 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                className="px-4 py-2 text-sm font-bold bg-card border border-border rounded-xl hover:border-primary disabled:opacity-50 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
