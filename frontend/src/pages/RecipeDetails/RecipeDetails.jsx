import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiClock, FiChevronLeft, FiCheckSquare, FiEdit, FiTrash2, FiHeart, FiBookmark, FiShare2, FiMessageCircle } from "react-icons/fi";
import api from "../../utils/api";
import { resolveImageUrl } from "../../utils/imageUtils";
import Container from "../../components/layout/Container";
import Section from "../../components/layout/Section";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import Toast from "../../components/ui/Toast";
import Spinner from "../../components/ui/Spinner";

export default function RecipeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [checkedIngredients, setCheckedIngredients] = useState({});
    
    // Social state
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [isSaved, setIsSaved] = useState(false);
    const [savesCount, setSavesCount] = useState(0);
    
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");

    // Toast state
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState("success");

    useEffect(() => {
        const fetchRecipe = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/recipes/${id}`);
                if (response.data && response.data.success) {
                    const fetchedRecipe = response.data.recipe;
                    setRecipe(fetchedRecipe);
                    setLikesCount(fetchedRecipe.likesCount || 0);
                    setSavesCount(fetchedRecipe.savesCount || 0);
                    
                    // Check if current user liked/saved it
                    const userStr = localStorage.getItem("user");
                    if (userStr) {
                        const user = JSON.parse(userStr);
                        // In a real app we'd fetch the user's updated profile to check likedRecipes/favorites
                        // For this UI, we'll just initialize it based on the response if we had it, 
                        // or fetch it from a user profile endpoint.
                        if (user.likedRecipes && user.likedRecipes.includes(fetchedRecipe._id)) setIsLiked(true);
                        if (user.favorites && user.favorites.includes(fetchedRecipe._id)) setIsSaved(true);
                    }
                }
                
                // Fetch comments
                const commentsRes = await api.get(`/comments/${id}`);
                if (commentsRes.data && commentsRes.data.success) {
                    setComments(commentsRes.data.data);
                }
            } catch (error) {
                console.error("Error fetching recipe details:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const handleIngredientToggle = (index) => {
        setCheckedIngredients((prev) => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this recipe?")) {
            try {
                await api.delete(`/recipes/${id}`);
                setToastType("success");
                setToastMsg("Recipe successfully deleted!");
                setIsToastOpen(true);
                setTimeout(() => {
                    navigate("/recipes");
                }, 1500);
            } catch (error) {
                const msg = error.response?.data?.message || "Failed to delete recipe.";
                setToastType("error");
                setToastMsg(msg);
                setIsToastOpen(true);
            }
        }
    };

    const handleToggleLike = async () => {
        try {
            const res = await api.post(`/recipes/${id}/like`);
            setIsLiked(res.data.isLiked);
            setLikesCount(res.data.likesCount);
        } catch (error) {
            setToastType("error");
            setToastMsg("Please login to like recipes.");
            setIsToastOpen(true);
        }
    };

    const handleToggleSave = async () => {
        try {
            const res = await api.post(`/recipes/${id}/save`);
            setIsSaved(res.data.isSaved);
            setSavesCount(res.data.savesCount);
        } catch (error) {
            setToastType("error");
            setToastMsg("Please login to save recipes.");
            setIsToastOpen(true);
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipe.title,
                    text: `Check out ${recipe.title} on RecipeHub!`,
                    url: url,
                });
            } catch (error) {
                console.log('Error sharing', error);
            }
        } else {
            navigator.clipboard.writeText(url);
            setToastType("success");
            setToastMsg("Link copied to clipboard!");
            setIsToastOpen(true);
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmittingComment(true);
        try {
            const response = await api.post(`/comments/${id}`, { text: newComment });
            if (response.data && response.data.success) {
                setComments([response.data.data, ...comments]);
                setNewComment("");
                setToastType("success");
                setToastMsg("Comment posted!");
                setIsToastOpen(true);
            }
        } catch (error) {
            setToastType("error");
            setToastMsg(error.response?.data?.message || "Failed to post comment.");
            setIsToastOpen(true);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Delete this comment?")) {
            try {
                await api.delete(`/comments/${commentId}`);
                setComments(comments.filter(c => c._id !== commentId));
            } catch (error) {
                setToastType("error");
                setToastMsg("Failed to delete comment.");
                setIsToastOpen(true);
            }
        }
    };

    const handleEditCommentSubmit = async (commentId) => {
        if (!editCommentText.trim()) return;
        try {
            const response = await api.put(`/comments/${commentId}`, { text: editCommentText });
            if (response.data && response.data.success) {
                setComments(comments.map(c => c._id === commentId ? response.data.data : c));
                setEditingCommentId(null);
                setEditCommentText("");
            }
        } catch (error) {
            setToastType("error");
            setToastMsg(error.response?.data?.message || "Failed to edit comment.");
            setIsToastOpen(true);
        }
    };

    if (isLoading) {
        return (
            <Container className="py-20 text-center">
                <Spinner size="lg" />
            </Container>
        );
    }

    if (!recipe) {
        return (
            <Container className="py-12 max-w-xl text-center">
                <Alert title="Recipe Not Found" variant="warning" className="mb-6">
                    The recipe you are looking for does not exist or may have been deleted.
                </Alert>
                <Button variant="outline" size="md" onClick={() => navigate("/recipes")}>
                    <FiChevronLeft size={16} className="inline mr-1" /> Back to Catalogue
                </Button>
            </Container>
        );
    }

    return (
        <div className="w-full bg-bg pb-24 font-body selection:bg-primary/30 selection:text-primary-dark">
            {/* Cinematic Full-Width Header */}
            {(() => {
                const authorName = recipe.author && typeof recipe.author === "object" ? recipe.author.name : (recipe.author || "Chef");
                const authorAvatar = recipe.author && typeof recipe.author === "object" ? recipe.author.avatar : null;
                const imageUrl = resolveImageUrl(recipe.image);
                
                const userStr = localStorage.getItem("user");
                const currentUser = userStr ? JSON.parse(userStr) : null;
                const canManage = currentUser && recipe.author && (
                    (typeof recipe.author === "object" && recipe.author._id === currentUser._id) ||
                    (recipe.author === currentUser._id) ||
                    currentUser.role === "admin"
                );

                return (
                    <header className="relative w-full min-h-[70vh] flex flex-col justify-end pb-16 pt-32 overflow-hidden border-b border-border/50 shadow-2xl">
                        {/* Background Image with heavy blur and overlay */}
                        <div className="absolute inset-0 -z-20">
                            {imageUrl ? (
                                <img src={imageUrl} alt="" className="w-full h-full object-cover blur-xl scale-110 opacity-40" />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-primary/20 via-bg to-accent/20"></div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-bg via-transparent to-transparent"></div>
                        </div>

                        <Container className="max-w-6xl relative z-10 w-full flex flex-col lg:flex-row items-end lg:items-center gap-12">
                            {/* Visual Image/Emoji Floating Plate */}
                            <div className="w-48 h-48 lg:w-72 lg:h-72 rounded-full bg-card border-[12px] border-bg/80 flex items-center justify-center text-8xl lg:text-9xl select-none shrink-0 shadow-[0_30px_60px_rgba(0,0,0,0.3)] overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                                {imageUrl ? (
                                    <img src={imageUrl} alt={recipe.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                                ) : (
                                    <span className="drop-shadow-2xl">{recipe.image || "🍲"}</span>
                                )}
                            </div>

                            {/* Details Meta */}
                            <div className="flex-1 flex flex-col gap-6 z-10 w-full animate-in fade-in slide-in-from-right-8 duration-700 delay-100 fill-mode-both text-left">
                                <div className="mb-2">
                                    <Link to="/recipes" className="inline-flex items-center gap-2 px-4 py-2 bg-card/50 backdrop-blur-md rounded-full text-sm font-bold text-text-h hover:text-primary hover:bg-card transition-colors shadow-sm border border-border/50">
                                        <FiChevronLeft size={16} /> Back to Catalogue
                                    </Link>
                                </div>

                                <div className="flex flex-wrap gap-3 items-center">
                                    <Badge variant="primary" className="px-4 py-1.5 text-sm shadow-lg shadow-primary/30 uppercase tracking-widest">{recipe.category}</Badge>
                                    <span className="flex items-center gap-1.5 text-sm text-text-h font-bold bg-card/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-border/50"><FiClock className="text-primary" /> {recipe.prepTime}</span>
                                    <span className="text-accent text-sm font-extrabold bg-card/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-border/50 flex items-center gap-1"><span className="text-lg leading-none">★</span> {(recipe.ratingsAverage || 4.5).toFixed(1)}</span>
                                </div>

                                <h1 className="text-5xl lg:text-7xl font-extrabold text-text-h font-heading m-0 leading-[1.05] tracking-tight drop-shadow-md">
                                    {recipe.title}
                                </h1>

                                <p className="text-text/80 text-xl leading-relaxed m-0 max-w-3xl font-medium drop-shadow-sm">
                                    {recipe.description}
                                </p>

                                <div className="flex flex-wrap justify-between items-center gap-6 pt-8 mt-2 border-t border-border/30">
                                    {/* Author */}
                                    <div className="flex items-center gap-4 bg-card/40 backdrop-blur-md pr-6 py-2 pl-2 rounded-full border border-border/50 shadow-sm">
                                        <Avatar name={authorName} src={authorAvatar} size="lg" className="shadow-md border-2 border-bg" />
                                        <div>
                                            <div className="text-[11px] text-text/60 font-bold uppercase tracking-widest mb-0.5">Master Chef</div>
                                            <div className="text-lg font-extrabold text-text-h">{authorName}</div>
                                        </div>
                                    </div>

                                    {/* Interactive Action Control */}
                                    <div className="flex items-center gap-4">
                                        {canManage && (
                                            <div className="flex gap-2 mr-4 border-r border-border/50 pr-6">
                                                <Button 
                                                    variant="outline" 
                                                    size="md" 
                                                    className="flex items-center gap-2 font-bold shadow-md hover:shadow-lg bg-card/50 backdrop-blur-md border-border/50"
                                                    onClick={() => navigate(`/edit-recipe/${recipe._id}`)}
                                                >
                                                    <FiEdit size={18} /> Edit
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    size="md" 
                                                    className="flex items-center gap-2 font-bold shadow-md hover:shadow-lg bg-red-500/10 text-danger border-red-500/20 backdrop-blur-md"
                                                    onClick={handleDelete}
                                                >
                                                    <FiTrash2 size={18} /> Delete
                                                </Button>
                                            </div>
                                        )}
                                        <button 
                                            onClick={handleToggleLike}
                                            className={`flex items-center gap-2 px-4 py-2 bg-card/60 backdrop-blur-md border border-border/50 rounded-full cursor-pointer transition-all duration-300 font-bold shadow-sm ${isLiked ? 'text-red-500 border-red-500 bg-red-50' : 'text-text/70 hover:text-red-500 hover:border-red-500'}`} 
                                            aria-label="Like"
                                        >
                                            <FiHeart size={20} className={isLiked ? "fill-current" : ""} />
                                            <span>{likesCount}</span>
                                        </button>
                                        <button 
                                            onClick={handleToggleSave}
                                            className={`flex items-center gap-2 px-4 py-2 bg-card/60 backdrop-blur-md border border-border/50 rounded-full cursor-pointer transition-all duration-300 font-bold shadow-sm ${isSaved ? 'text-info border-info bg-blue-50' : 'text-text/70 hover:text-info hover:border-info'}`} 
                                            aria-label="Bookmark"
                                        >
                                            <FiBookmark size={20} className={isSaved ? "fill-current" : ""} />
                                            <span>{savesCount}</span>
                                        </button>
                                        <button 
                                            onClick={handleShare}
                                            className="w-10 h-10 flex items-center justify-center bg-card/60 backdrop-blur-md border border-border/50 rounded-full cursor-pointer transition-all duration-300 text-text/70 hover:text-primary hover:border-primary shadow-sm" 
                                            aria-label="Share"
                                        >
                                            <FiShare2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Container>
                    </header>
                );
            })()}

            <Container className="max-w-6xl mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 fill-mode-both">
                {/* Split Screen Grid (Ingredients vs Instructions) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Ingredients Checklists (Col span 4) */}
                    <div className="lg:col-span-4 flex flex-col gap-6 text-left">
                        <div className="glass-card rounded-[2rem] p-8 shadow-xl sticky top-32 border border-border/50">
                            <h2 className="text-2xl font-extrabold text-text-h font-heading m-0 mb-3 flex items-center gap-3 pb-4 border-b border-border/50">
                                <span className="p-2.5 bg-primary-light text-primary rounded-2xl shadow-sm"><FiCheckSquare size={22} /></span> Ingredients
                            </h2>
                            <p className="text-sm text-text/60 font-semibold mb-6 mt-4">Check off items as you gather them:</p>
                            
                            <ul className="list-none p-0 m-0 flex flex-col gap-3">
                                {recipe.ingredients.map((ingredient, idx) => (
                                    <li 
                                        key={idx}
                                        onClick={() => handleIngredientToggle(idx)}
                                        className={`flex items-start gap-4 p-4 rounded-2xl border-2 hover:shadow-md cursor-pointer select-none transition-all duration-300
                                            ${checkedIngredients[idx] 
                                                ? "opacity-50 bg-code-bg/50 border-transparent" 
                                                : "bg-card border-border/30 hover:border-primary/40 shadow-sm"
                                            }
                                        `}
                                    >
                                        <input 
                                            type="checkbox" 
                                            checked={!!checkedIngredients[idx]} 
                                            onChange={() => {}} // Controlled by LI click
                                            className="h-6 w-6 rounded-lg border-2 border-border/80 text-primary focus:ring-primary/20 accent-primary cursor-pointer mt-0.5 shrink-0 transition-all shadow-sm"
                                        />
                                        <span className={`text-base text-text font-bold leading-relaxed pt-0.5
                                            ${checkedIngredients[idx] ? "line-through text-text/40" : ""}
                                        `}>
                                            {ingredient}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Instructions List (Col span 8) */}
                    <div className="lg:col-span-8 flex flex-col gap-6 text-left">
                        <div className="glass-card rounded-[2rem] p-8 sm:p-12 shadow-xl border border-border/50">
                            <h2 className="text-3xl font-extrabold text-text-h font-heading m-0 mb-10 pb-6 border-b border-border/50 tracking-tight">
                                Method & Preparation
                            </h2>
                            
                            <div className="relative">
                                {/* Vertical Timeline Line */}
                                <div className="absolute left-6 top-6 bottom-6 w-1 bg-code-bg rounded-full hidden sm:block"></div>
                                
                                <ol className="list-none p-0 m-0 flex flex-col gap-10 relative">
                                    {recipe.instructions.map((step, idx) => (
                                        <li key={idx} className="flex gap-6 items-start group">
                                            {/* Timeline Node */}
                                            <div className="relative z-10">
                                                <div className="w-12 h-12 rounded-2xl bg-card text-primary font-black text-xl flex items-center justify-center shrink-0 border-4 border-code-bg group-hover:border-primary/20 shadow-md group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                    {idx + 1}
                                                </div>
                                            </div>
                                            
                                            {/* Step Content */}
                                            <div className="flex-1 bg-card/40 rounded-2xl p-6 border border-border/30 shadow-sm group-hover:shadow-md group-hover:bg-card transition-all duration-300 group-hover:-translate-y-1">
                                                <h4 className="text-sm font-black text-primary uppercase tracking-widest mb-3 opacity-80">Step {idx + 1}</h4>
                                                <p className="text-lg text-text leading-relaxed m-0 font-medium group-hover:text-text-h transition-colors">
                                                    {step}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-16 glass-card rounded-[2rem] p-8 sm:p-12 shadow-xl border border-border/50 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-extrabold text-text-h font-heading m-0 mb-8 pb-6 border-b border-border/50 flex items-center gap-3">
                        <FiMessageCircle className="text-primary" /> Discussion
                    </h2>

                    <form onSubmit={handlePostComment} className="mb-10">
                        <div className="relative">
                            <textarea 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="What are your thoughts on this recipe?"
                                className="w-full bg-card border border-border/50 rounded-2xl p-4 min-h-[120px] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-text transition-all resize-none shadow-inner"
                            ></textarea>
                            <div className="absolute bottom-4 right-4">
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    size="sm" 
                                    className="rounded-xl shadow-md"
                                    disabled={isSubmittingComment || !newComment.trim()}
                                >
                                    {isSubmittingComment ? "Posting..." : "Post Comment"}
                                </Button>
                            </div>
                        </div>
                    </form>

                    <div className="space-y-6">
                        {comments.length === 0 ? (
                            <div className="text-center py-8 text-text/50 italic">
                                No comments yet. Be the first to share your thoughts!
                            </div>
                        ) : (
                            comments.map((comment) => {
                                const userStr = localStorage.getItem("user");
                                const currentUser = userStr ? JSON.parse(userStr) : null;
                                const isAuthor = currentUser && (comment.author._id === currentUser._id || comment.author === currentUser._id);
                                
                                return (
                                    <div key={comment._id} className="flex gap-4 p-4 rounded-2xl bg-card border border-border/30 shadow-sm animate-in fade-in slide-in-from-bottom-4">
                                        <Avatar 
                                            name={comment.author.name || "User"} 
                                            src={comment.author.avatar} 
                                            size="md" 
                                            className="shrink-0" 
                                        />
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <div>
                                                    <span className="font-bold text-text-h mr-2">{comment.author.name}</span>
                                                    <span className="text-xs text-text/50">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                {isAuthor && (
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => {
                                                                setEditingCommentId(comment._id);
                                                                setEditCommentText(comment.text);
                                                            }}
                                                            className="text-text/40 hover:text-primary p-1 transition-colors"
                                                            aria-label="Edit comment"
                                                        >
                                                            <FiEdit size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            className="text-text/40 hover:text-danger p-1 transition-colors"
                                                            aria-label="Delete comment"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            {editingCommentId === comment._id ? (
                                                <div className="mt-2">
                                                    <textarea 
                                                        value={editCommentText}
                                                        onChange={(e) => setEditCommentText(e.target.value)}
                                                        className="w-full bg-bg border border-border/50 rounded-xl p-3 min-h-[80px] focus:ring-1 focus:ring-primary/30 outline-none text-sm text-text resize-none mb-2"
                                                    ></textarea>
                                                    <div className="flex gap-2 justify-end">
                                                        <Button variant="outline" size="sm" onClick={() => setEditingCommentId(null)}>Cancel</Button>
                                                        <Button variant="primary" size="sm" onClick={() => handleEditCommentSubmit(comment._id)}>Save</Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-text/80 text-sm leading-relaxed whitespace-pre-wrap">{comment.text}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

            {/* Toast feedback */}
            <Toast 
                isOpen={isToastOpen}
                message={toastMsg}
                type={toastType}
                onClose={() => setIsToastOpen(false)}
            />
            </Container>
        </div>
    );
}