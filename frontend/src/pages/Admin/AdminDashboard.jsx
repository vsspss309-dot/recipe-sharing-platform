import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiFileText, FiActivity, FiShield, FiTrash2, FiEdit2, FiCheckCircle } from "react-icons/fi";
import api from "../../utils/api";
import Container from "../../components/layout/Container";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Toast from "../../components/ui/Toast";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [activeTab, setActiveTab] = useState("overview"); // overview, users, recipes
    const [isLoading, setIsLoading] = useState(true);

    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState("success");

    useEffect(() => {
        // Quick role check
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            navigate("/login");
            return;
        }
        const user = JSON.parse(userStr);
        if (user.role !== "admin") {
            navigate("/dashboard");
            return;
        }
        
        loadData();
    }, [navigate]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [statsRes, usersRes, recipesRes] = await Promise.all([
                api.get("/admin/stats"),
                api.get("/admin/users"),
                api.get("/recipes", { params: { limit: 100 } })
            ]);
            
            if (statsRes.data?.success) setStats(statsRes.data.data);
            if (usersRes.data?.success) setUsers(usersRes.data.data);
            if (recipesRes.data?.success) setRecipes(recipesRes.data.recipes);
        } catch (error) {
            console.error("Admin dashboard load error:", error);
            showToast("error", "Failed to load admin data");
        } finally {
            setIsLoading(false);
        }
    };

    const showToast = (type, msg) => {
        setToastType(type);
        setToastMsg(msg);
        setIsToastOpen(true);
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            showToast("success", `User role updated to ${newRole}`);
        } catch (error) {
            showToast("error", "Failed to update user role");
        }
    };

    const handleDeleteUser = async (userId, userName) => {
        if (window.confirm(`Are you sure you want to permanently delete user ${userName}?`)) {
            try {
                await api.delete(`/admin/users/${userId}`);
                setUsers(users.filter(u => u._id !== userId));
                showToast("success", "User deleted successfully");
            } catch (error) {
                showToast("error", "Failed to delete user");
            }
        }
    };

    const handleDeleteRecipe = async (recipeId, recipeTitle) => {
        if (window.confirm(`Moderation: Delete recipe "${recipeTitle}"?`)) {
            try {
                await api.delete(`/admin/recipes/${recipeId}`);
                setRecipes(recipes.filter(r => r._id !== recipeId));
                showToast("success", "Recipe deleted successfully");
            } catch (error) {
                showToast("error", "Failed to delete recipe");
            }
        }
    };

    if (isLoading) {
        return (
            <Container className="py-20 text-center">
                <Spinner size="lg" />
            </Container>
        );
    }

    return (
        <div className="w-full bg-bg pb-24 font-body min-h-screen">
            <header className="bg-card border-b border-border/50 pt-32 pb-8 shadow-sm">
                <Container className="max-w-6xl flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="p-2 bg-red-500/10 text-red-500 rounded-lg"><FiShield size={24} /></span>
                            <h1 className="text-4xl font-extrabold text-text-h font-heading m-0">Admin Console</h1>
                        </div>
                        <p className="text-text/60">Platform moderation and analytics hub.</p>
                    </div>
                </Container>
            </header>

            <Container className="max-w-6xl mt-8">
                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-border/50 pb-2">
                    <button 
                        onClick={() => setActiveTab("overview")}
                        className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-text/60 hover:text-text'}`}
                    >
                        <FiActivity size={16} /> Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab("users")}
                        className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'users' ? 'border-primary text-primary' : 'border-transparent text-text/60 hover:text-text'}`}
                    >
                        <FiUsers size={16} /> Users
                    </button>
                    <button 
                        onClick={() => setActiveTab("recipes")}
                        className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'recipes' ? 'border-primary text-primary' : 'border-transparent text-text/60 hover:text-text'}`}
                    >
                        <FiFileText size={16} /> Content Moderation
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="glass-card p-6 rounded-2xl border border-border/50 flex flex-col gap-2">
                            <span className="text-text/50 font-bold uppercase text-xs">Total Users</span>
                            <span className="text-4xl font-black text-text-h">{stats.totalUsers}</span>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-border/50 flex flex-col gap-2">
                            <span className="text-text/50 font-bold uppercase text-xs">Pro / Chef Subscriptions</span>
                            <span className="text-4xl font-black text-primary">{stats.premiumUsers}</span>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-border/50 flex flex-col gap-2">
                            <span className="text-text/50 font-bold uppercase text-xs">Total Recipes</span>
                            <span className="text-4xl font-black text-text-h">{stats.totalRecipes}</span>
                        </div>
                        <div className="glass-card p-6 rounded-2xl border border-border/50 flex flex-col gap-2">
                            <span className="text-text/50 font-bold uppercase text-xs">Total Comments</span>
                            <span className="text-4xl font-black text-info">{stats.totalComments}</span>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-code-bg/50 border-b border-border/50">
                                    <tr>
                                        <th className="p-4 text-xs font-bold uppercase text-text/60">Name</th>
                                        <th className="p-4 text-xs font-bold uppercase text-text/60">Email</th>
                                        <th className="p-4 text-xs font-bold uppercase text-text/60">Tier</th>
                                        <th className="p-4 text-xs font-bold uppercase text-text/60">Role</th>
                                        <th className="p-4 text-xs font-bold uppercase text-text/60 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id} className="border-b border-border/30 hover:bg-code-bg/30">
                                            <td className="p-4 font-bold text-text-h">{u.name}</td>
                                            <td className="p-4 text-sm text-text/70">{u.email}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${u.subscriptionTier === 'Pro' || u.subscriptionTier === 'Chef' ? 'bg-primary/20 text-primary' : 'bg-code-bg text-text/60'}`}>
                                                    {u.subscriptionTier}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <select 
                                                    value={u.role} 
                                                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                    className="bg-card border border-border/50 rounded p-1 text-sm text-text outline-none"
                                                >
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleDeleteUser(u._id, u.name)} className="p-2 text-text/40 hover:text-danger transition-colors">
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'recipes' && (
                    <div className="glass-card rounded-2xl border border-border/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-code-bg/50 border-b border-border/50">
                                    <tr>
                                        <th className="p-4 text-xs font-bold uppercase text-text/60">Title</th>
                                        <th className="p-4 text-xs font-bold uppercase text-text/60">Category</th>
                                        <th className="p-4 text-xs font-bold uppercase text-text/60">Author</th>
                                        <th className="p-4 text-xs font-bold uppercase text-text/60">Reported/Flags</th>
                                        <th className="p-4 text-xs font-bold uppercase text-text/60 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recipes.map(r => (
                                        <tr key={r._id} className="border-b border-border/30 hover:bg-code-bg/30">
                                            <td className="p-4 font-bold text-text-h text-sm cursor-pointer hover:text-primary" onClick={() => navigate(`/recipes/${r._id}`)}>{r.title}</td>
                                            <td className="p-4 text-sm text-text/70">{r.category}</td>
                                            <td className="p-4 text-sm text-text/70">{r.author?.name || 'Unknown'}</td>
                                            <td className="p-4 text-sm text-text/40 italic">Clean</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleDeleteRecipe(r._id, r.title)} className="p-2 text-text/40 hover:text-danger transition-colors" title="Delete Recipe">
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </Container>

            <Toast isOpen={isToastOpen} message={toastMsg} type={toastType} onClose={() => setIsToastOpen(false)} />
        </div>
    );
}
