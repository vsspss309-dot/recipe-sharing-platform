import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiClock, FiHeart, FiTrash2 } from "react-icons/fi";
import api from "../../utils/api";
import { resolveImageUrl } from "../../utils/imageUtils";
import Card, { CardContent, CardFooter } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import Button from "../../components/ui/Button";

export default function SavedRecipes() {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchSavedRecipes = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/users/saved");
            if (response.data && response.data.success) {
                setSavedRecipes(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching saved recipes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedRecipes();
    }, []);

    const handleUnsave = async (e, recipeId) => {
        e.stopPropagation();
        try {
            const response = await api.post(`/recipes/${recipeId}/save`);
            if (response.data && response.data.success) {
                // Remove from local state immediately for snappy UI
                setSavedRecipes(prev => prev.filter(recipe => recipe._id !== recipeId));
            }
        } catch (error) {
            console.error("Error unsaving recipe:", error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64 w-full">
                <Spinner size="lg" className="text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-text-h font-heading mb-2">Saved Recipes</h1>
                <p className="text-text/70">Manage and revisit your favorite culinary discoveries.</p>
            </div>

            {savedRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {savedRecipes.map((recipe) => {
                        const imageUrl = resolveImageUrl(recipe.image);

                        return (
                            <Card
                                key={recipe._id}
                                className="flex flex-col h-full rounded-[2rem] border border-border/40 hover:border-primary/30 hover:shadow-lg cursor-pointer transition-all duration-300 group bg-card overflow-hidden relative"
                                onClick={() => navigate(`/recipes/${recipe._id}`)}
                            >
                                <div className="absolute top-5 right-5 z-20">
                                    <button
                                        onClick={(e) => handleUnsave(e, recipe._id)}
                                        className="w-10 h-10 bg-bg/80 backdrop-blur-md border border-border/50 rounded-full flex items-center justify-center text-danger hover:bg-danger hover:text-white transition-colors shadow-lg"
                                        title="Remove from saved"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>

                                <div className="relative h-56 bg-code-bg flex items-center justify-center text-6xl select-none overflow-hidden">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <span className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{recipe.image || "🍲"}</span>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent opacity-60"></div>
                                    <div className="absolute bottom-4 left-5 z-10">
                                        <Badge variant="primary" className="shadow-md bg-bg/60 backdrop-blur-md border border-border/50 text-text-h font-bold">
                                            {recipe.category}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="flex-1 flex flex-col p-6 pt-5">
                                    <div className="flex gap-4 items-center text-xs text-text/60 font-bold uppercase mb-2">
                                        <span className="flex items-center gap-1.5"><FiClock size={12} className="text-primary" /> {recipe.cookingTime || 30} Mins</span>
                                        <span className="text-accent flex items-center gap-1">★ {(recipe.ratingsAverage || 4.5).toFixed(1)}</span>
                                    </div>
                                    
                                    <h3 className="font-heading font-extrabold text-xl text-text-h m-0 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                        {recipe.title}
                                    </h3>
                                    
                                    <p className="text-sm text-text/70 line-clamp-2 leading-relaxed m-0 font-medium">
                                        {recipe.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border/50 rounded-3xl mt-8">
                    <span className="text-6xl mb-4 opacity-50">💔</span>
                    <h3 className="text-2xl font-bold text-text-h font-heading mb-2">No Saved Recipes</h3>
                    <p className="text-text/70 mb-6 max-w-sm">
                        You haven't saved any recipes yet. Browse the community and hit the heart icon to save them here!
                    </p>
                    <Button variant="primary" onClick={() => navigate("/recipes")}>
                        Explore Recipes
                    </Button>
                </div>
            )}
        </div>
    );
}
