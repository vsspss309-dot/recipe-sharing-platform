import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus, FiRotateCcw, FiTrash2, FiEdit, FiGrid, FiActivity, FiStar, FiDatabase, FiAward, FiHeart, FiBell, FiCheck } from "react-icons/fi";
import api from "../../utils/api";
import { resolveImageUrl } from "../../utils/imageUtils";
import Button from "../../components/ui/Button";
import Toast from "../../components/ui/Toast";
import Spinner from "../../components/ui/Spinner";

export default function Dashboard() {
    const navigate = useNavigate();
    const [recipes, setRecipes] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [dashboardMetrics, setDashboardMetrics] = useState(null);
    const [activeTab, setActiveTab] = useState("my-recipes"); // my-recipes, favorites, notifications
    const [isLoading, setIsLoading] = useState(true);
    
    // Toast state
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState("success");

    const loadData = async () => {
        setIsLoading(true);
        try {
            const userStr = localStorage.getItem("user");
            const currentUser = userStr ? JSON.parse(userStr) : null;
            if (currentUser) {
                const [recipesRes, favoritesRes, notifRes, metricsRes] = await Promise.all([
                    api.get("/recipes", { params: { author: currentUser._id, limit: 100 } }),
                    api.get("/recipes", { params: { favoritedBy: currentUser._id, limit: 100 } }), // Ensure this works in backend
                    api.get("/notifications").catch(() => ({ data: { success: false, data: [] } })),
                    api.get("/dashboard").catch(() => ({ data: { success: false, data: null } }))
                ]);
                
                if (recipesRes.data?.success) setRecipes(recipesRes.data.recipes);
                if (favoritesRes.data?.success) setFavorites(favoritesRes.data.recipes);
                if (notifRes.data?.success) setNotifications(notifRes.data.data);
                if (metricsRes.data?.success) setDashboardMetrics(metricsRes.data.data);
            }
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const triggerToast = (type, msg) => {
        setToastType(type);
        setToastMsg(msg);
        setIsToastOpen(true);
    };

    const handleDelete = async (id, title) => {
        if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
            try {
                await api.delete(`/recipes/${id}`);
                loadData();
                triggerToast("success", `Deleted recipe: ${title}`);
            } catch (error) {
                const msg = error.response?.data?.message || "Failed to delete recipe.";
                triggerToast("error", msg);
            }
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await api.put(`/notifications/read/${id}`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark as read");
        }
    };

    // Calculate metrics
    const totalRecipes = recipes.length;
    const uniqueCategories = new Set(recipes.map(r => r.category)).size;
    const avgRating = totalRecipes > 0 
        ? (recipes.reduce((sum, r) => sum + (r.ratingsAverage || 4.5), 0) / totalRecipes).toFixed(1) 
        : "0.0";

    return (
        <div className="dashboard-content-card">
            {/* Header section inside content card */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-border">
                <div>
                    <h1 className="text-3xl font-extrabold text-text-h font-heading m-0 mb-1">Kitchen Console</h1>
                    <p className="text-text/60 text-sm m-0">Monitor statistics, manage recipe collections, and toggle database states.</p>
                </div>
                
                {/* Actions group */}
                <div className="flex flex-wrap gap-2.5">
                    <Button 
                        variant="primary" 
                        size="sm" 
                        onClick={() => navigate("/add-recipe")} 
                        className="flex items-center gap-1.5 font-semibold text-xs cursor-pointer shadow-xs"
                    >
                        <FiPlus size={14} /> Add Recipe
                    </Button>
                </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex gap-4 mb-6 border-b border-border/50 pb-2 overflow-x-auto scrollbar-hide">
                <button 
                    onClick={() => setActiveTab("my-recipes")}
                    className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'my-recipes' ? 'border-primary text-primary' : 'border-transparent text-text/60 hover:text-text'}`}
                >
                    <FiDatabase size={16} /> My Recipes
                </button>
                <button 
                    onClick={() => setActiveTab("favorites")}
                    className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'favorites' ? 'border-primary text-primary' : 'border-transparent text-text/60 hover:text-text'}`}
                >
                    <FiHeart size={16} /> Favorites ({favorites.length})
                </button>
                <button 
                    onClick={() => setActiveTab("notifications")}
                    className={`pb-2 px-1 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'notifications' ? 'border-primary text-primary' : 'border-transparent text-text/60 hover:text-text'}`}
                >
                    <FiBell size={16} /> Notifications
                    {notifications.filter(n => !n.isRead).length > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1">
                            {notifications.filter(n => !n.isRead).length}
                        </span>
                    )}
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Spinner size="lg" />
                </div>
            ) : (
                <>
                    {/* Render My Recipes Tab */}
                    {activeTab === 'my-recipes' && (
                        <>
                            {totalRecipes > 0 ? (
                                <>
                                    {/* Stats Metrics Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
                                        <div className="bg-gradient-to-br from-primary-light to-card border border-primary/20 p-5 rounded-medium flex items-center gap-4">
                                            <span className="p-3 bg-card text-primary rounded-medium border border-primary/10 shadow-xs"><FiDatabase size={22} /></span>
                                            <div>
                                                <div className="text-[10px] text-text/50 font-bold uppercase tracking-wider">Total Recipes</div>
                                                <div className="text-xl font-extrabold text-text-h font-heading">{dashboardMetrics?.totalRecipes || totalRecipes}</div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-secondary/10 to-card border border-secondary/20 p-5 rounded-medium flex items-center gap-4">
                                            <span className="p-3 bg-card text-secondary rounded-medium border border-secondary/10 shadow-xs"><FiHeart size={22} /></span>
                                            <div>
                                                <div className="text-[10px] text-text/50 font-bold uppercase tracking-wider">Total Likes</div>
                                                <div className="text-xl font-extrabold text-text-h font-heading">{dashboardMetrics?.totalLikes || 0}</div>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-br from-accent/10 to-card border border-accent/20 p-5 rounded-medium flex items-center gap-4">
                                            <span className="p-3 bg-card text-accent rounded-medium border border-accent/10 shadow-xs"><FiStar size={22} /></span>
                                            <div>
                                                <div className="text-[10px] text-text/50 font-bold uppercase tracking-wider">Total Saves</div>
                                                <div className="text-xl font-extrabold text-text-h font-heading">{dashboardMetrics?.totalBookmarks || 0}</div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gradient-to-br from-info/10 to-card border border-info/20 p-5 rounded-medium flex items-center gap-4">
                                            <span className="p-3 bg-card text-info rounded-medium border border-info/10 shadow-xs"><FiActivity size={22} /></span>
                                            <div>
                                                <div className="text-[10px] text-text/50 font-bold uppercase tracking-wider">Total Comments</div>
                                                <div className="text-xl font-extrabold text-text-h font-heading">{dashboardMetrics?.totalComments || 0}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Table View of Recipes */}
                                    <div className="border border-border rounded-medium overflow-hidden bg-card shadow-xs">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse m-0">
                                                <thead>
                                                    <tr className="bg-code-bg/40 border-b border-border">
                                                        <th className="p-4 text-xs font-bold uppercase text-text/60 tracking-wider w-16 text-center">Dish</th>
                                                        <th className="p-4 text-xs font-bold uppercase text-text/60 tracking-wider">Recipe Title</th>
                                                        <th className="p-4 text-xs font-bold uppercase text-text/60 tracking-wider">Category</th>
                                                        <th className="p-4 text-xs font-bold uppercase text-text/60 tracking-wider">Time</th>
                                                        <th className="p-4 text-xs font-bold uppercase text-text/60 tracking-wider">Author</th>
                                                        <th className="p-4 text-xs font-bold uppercase text-text/60 tracking-wider w-24 text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {recipes.map((recipe) => {
                                                        const hasImage = !!resolveImageUrl(recipe.image);
                                                        const imageUrl = resolveImageUrl(recipe.image);
                                                        const authorName = recipe.author && typeof recipe.author === "object" ? recipe.author.name : (recipe.author || "Chef");
                                                        return (
                                                            <tr key={recipe._id} className="border-b border-border hover:bg-code-bg/10 transition-colors">
                                                                <td className="p-4 text-center text-3xl select-none w-16">
                                                                    {hasImage ? (
                                                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-border mx-auto flex items-center justify-center">
                                                                            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                                                                        </div>
                                                                    ) : (
                                                                        recipe.image || "🍲"
                                                                    )}
                                                                </td>
                                                                <td className="p-4 font-bold text-text-h text-sm">
                                                                    <span 
                                                                        className="hover:text-primary cursor-pointer transition-colors"
                                                                        onClick={() => navigate(`/recipes/${recipe._id}`)}
                                                                    >
                                                                        {recipe.title}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4">
                                                                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary-light text-primary border border-primary/10">
                                                                        {recipe.category}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 text-xs font-semibold text-text/70">{recipe.prepTime}</td>
                                                                <td className="p-4 text-xs font-bold text-text/80">{authorName}</td>
                                                                <td className="p-4">
                                                                    <div className="flex justify-center items-center gap-2">
                                                                        <button
                                                                            onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                                                                            className="p-1.5 border border-border rounded hover:bg-code-bg hover:text-primary transition-colors cursor-pointer"
                                                                            aria-label="Edit recipe"
                                                                        >
                                                                            <FiEdit size={14} />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDelete(recipe._id, recipe.title)}
                                                                            className="p-1.5 border border-border rounded hover:bg-red-50 hover:text-danger hover:border-red-200 transition-colors cursor-pointer"
                                                                            aria-label="Delete recipe"
                                                                        >
                                                                            <FiTrash2 size={14} />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-medium bg-code-bg/10 p-8 max-w-xl mx-auto my-6">
                                    <span className="text-7xl mb-4 select-none">🍽️</span>
                                    <h3 className="text-xl font-bold text-text-h font-heading m-0 mb-2">Your Kitchen is Empty</h3>
                                    <p className="text-text/60 text-sm max-w-sm leading-relaxed m-0 mb-6">
                                        There are currently no recipes stored in your local kitchen dashboard. You can create a new recipe or restore the standard sample list.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <Button 
                                            variant="primary" 
                                            size="md" 
                                            onClick={() => navigate("/add-recipe")} 
                                            className="font-semibold shadow-xs flex items-center justify-center gap-1.5"
                                        >
                                            <FiPlus size={16} /> Create First Recipe
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="md" 
                                            onClick={() => navigate("/recipes")} 
                                            className="font-semibold shadow-xs flex items-center justify-center gap-1.5"
                                        >
                                            <FiRotateCcw size={16} /> Browse All Recipes
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Render Favorites Tab */}
                    {activeTab === 'favorites' && (
                        <>
                            {favorites.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {favorites.map(recipe => {
                                        const imageUrl = resolveImageUrl(recipe.image);
                                        return (
                                            <div key={recipe._id} className="bg-card border border-border rounded-medium overflow-hidden shadow-sm flex flex-col group cursor-pointer hover:shadow-md transition-all" onClick={() => navigate(`/recipes/${recipe._id}`)}>
                                                <div className="h-40 w-full overflow-hidden bg-code-bg/50 relative">
                                                    {imageUrl ? (
                                                        <img src={imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-4xl">{recipe.image || "🍲"}</div>
                                                    )}
                                                </div>
                                                <div className="p-4 flex flex-col flex-1">
                                                    <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1">{recipe.category}</div>
                                                    <h3 className="font-heading font-extrabold text-lg text-text-h mb-2">{recipe.title}</h3>
                                                    <p className="text-text/70 text-sm line-clamp-2 mt-auto">{recipe.description}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-16 border border-dashed border-border rounded-medium bg-code-bg/10 max-w-xl mx-auto">
                                    <span className="text-5xl mb-4 select-none block">🔖</span>
                                    <h3 className="text-xl font-bold text-text-h font-heading mb-2">No Favorites Yet</h3>
                                    <p className="text-text/60 text-sm mb-6">Bookmark your favorite recipes across the platform to save them here.</p>
                                    <Button variant="outline" size="md" onClick={() => navigate("/recipes")}>Browse Recipes</Button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Render Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="max-w-3xl">
                            {notifications.length > 0 ? (
                                <div className="flex flex-col gap-3">
                                    {notifications.map(notif => (
                                        <div key={notif._id} className={`flex items-start gap-4 p-4 rounded-medium border transition-colors ${notif.isRead ? 'bg-card border-border/50' : 'bg-primary/5 border-primary/20 shadow-sm'}`}>
                                            <div className="w-10 h-10 rounded-full bg-card overflow-hidden shrink-0 border border-border">
                                                {notif.sender?.avatar ? (
                                                    <img src={resolveImageUrl(notif.sender.avatar)} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-code-bg font-bold text-text/50">
                                                        {notif.sender?.name?.charAt(0) || '?'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-text-h mb-1">{notif.message}</p>
                                                <span className="text-xs text-text/50">{new Date(notif.createdAt).toLocaleString()}</span>
                                            </div>
                                            {!notif.isRead && (
                                                <button 
                                                    onClick={() => handleMarkAsRead(notif._id)}
                                                    className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                                    title="Mark as read"
                                                >
                                                    <FiCheck size={16} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 border border-dashed border-border rounded-medium bg-code-bg/10">
                                    <span className="text-5xl mb-4 select-none block">🔔</span>
                                    <h3 className="text-xl font-bold text-text-h font-heading mb-2">You're All Caught Up!</h3>
                                    <p className="text-text/60 text-sm">You have no new notifications.</p>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Toast Alerts */}
            <Toast 
                isOpen={isToastOpen}
                message={toastMsg}
                type={toastType}
                onClose={() => setIsToastOpen(false)}
            />
        </div>
    );
}