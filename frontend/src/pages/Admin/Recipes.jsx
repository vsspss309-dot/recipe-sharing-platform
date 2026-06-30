import { useState, useEffect } from "react";
import { FiTrash2, FiSearch, FiEye, FiClock, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import Spinner from "../../components/ui/Spinner";

export default function AdminRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");

    const fetchRecipes = async () => {
        setIsLoading(true);
        try {
            const response = await api.get(`/admin/recipes?page=${page}&limit=10&search=${search}`);
            if (response.data?.success) {
                setRecipes(response.data.data);
                setTotalPages(response.data.pages);
            }
        } catch (error) {
            console.error("Failed to fetch recipes", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchRecipes();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [page, search]);

    const handleDelete = async (recipeId) => {
        if (!window.confirm("Are you sure you want to delete this recipe?")) return;
        
        try {
            const res = await api.delete(`/admin/recipes/${recipeId}`);
            if (res.data?.success) {
                setRecipes(recipes.filter(r => r._id !== recipeId));
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete recipe");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-extrabold text-text-h font-heading">Recipe Moderation</h2>
                    <p className="text-text/60">View and manage all user-submitted recipes.</p>
                </div>
                
                <div className="relative w-full md:w-64">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40" />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                        className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-code-bg/50 border-b border-border">
                                <th className="p-4 font-bold text-text-h text-sm">Recipe Title</th>
                                <th className="p-4 font-bold text-text-h text-sm">Author</th>
                                <th className="p-4 font-bold text-text-h text-sm">Stats</th>
                                <th className="p-4 font-bold text-text-h text-sm">Date</th>
                                <th className="p-4 font-bold text-text-h text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center">
                                        <Spinner size="md" />
                                    </td>
                                </tr>
                            ) : recipes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-text/50 italic">
                                        No recipes found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                recipes.map(recipe => (
                                    <tr key={recipe._id} className="hover:bg-code-bg/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-border overflow-hidden shrink-0">
                                                    {recipe.image ? (
                                                        <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-text/30">
                                                            <FiEye />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-text-h line-clamp-1">{recipe.title}</div>
                                                    <div className="text-xs text-text/60">{recipe.category} • {recipe.difficulty}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm font-semibold text-text">
                                            {recipe.author?.name || "Unknown User"}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3 text-xs font-semibold text-text/60">
                                                <span className="flex items-center gap-1"><FiStar className="text-yellow-500" /> {recipe.likesCount}</span>
                                                <span className="flex items-center gap-1"><FiClock /> {recipe.cookingTime}m</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-text/70">
                                            {new Date(recipe.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Link 
                                                to={`/recipe/${recipe._id}`}
                                                target="_blank"
                                                className="inline-block p-2 text-text/40 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="View Recipe"
                                            >
                                                <FiEye size={18} />
                                            </Link>
                                            <button 
                                                onClick={() => handleDelete(recipe._id)}
                                                className="inline-block p-2 text-text/40 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Recipe"
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
