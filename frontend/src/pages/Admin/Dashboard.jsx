import { useState, useEffect } from "react";
import { FiUsers, FiFileText, FiMessageSquare, FiGrid, FiHeart, FiStar } from "react-icons/fi";
import api from "../../utils/api";
import Spinner from "../../components/ui/Spinner";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/admin/dashboard");
                if (response.data && response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Spinner size="xl" />
            </div>
        );
    }

    const statCards = [
        { label: "Total Users", value: stats?.totalUsers || 0, icon: <FiUsers size={24} />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Total Recipes", value: stats?.totalRecipes || 0, icon: <FiFileText size={24} />, color: "text-primary", bg: "bg-primary/10" },
        { label: "Total Comments", value: stats?.totalComments || 0, icon: <FiMessageSquare size={24} />, color: "text-secondary", bg: "bg-secondary/10" },
        { label: "Categories", value: stats?.totalCategories || 0, icon: <FiGrid size={24} />, color: "text-purple-500", bg: "bg-purple-500/10" },
        { label: "Total Likes", value: stats?.totalLikes || 0, icon: <FiHeart size={24} />, color: "text-red-500", bg: "bg-red-500/10" },
        { label: "Total Saves", value: stats?.totalBookmarks || 0, icon: <FiStar size={24} />, color: "text-yellow-500", bg: "bg-yellow-500/10" }
    ];

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-extrabold text-text-h font-heading mb-2">Dashboard Overview</h2>
            <p className="text-text/60 mb-8">Welcome to the RecipeHub Administration Console.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-10">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${card.bg} ${card.color}`}>
                            {card.icon}
                        </div>
                        <div className="text-sm font-bold text-text/60 uppercase tracking-wider mb-1">{card.label}</div>
                        <div className="text-3xl font-black text-text-h">{card.value.toLocaleString()}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Reports Placeholder */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-text-h mb-4 border-b border-border pb-2">Recent Reports</h3>
                    <div className="text-center py-10 text-text/50 italic text-sm">
                        No recent reports to display.
                    </div>
                </div>

                {/* System Health Placeholder */}
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-text-h mb-4 border-b border-border pb-2">System Health</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-text">Database Server</span>
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-md">Online</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-text">API Gateway</span>
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-md">Online</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-text">Cloudinary Storage</span>
                            <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-md">Online</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
