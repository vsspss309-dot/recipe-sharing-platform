import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiClock, FiHeart, FiBookmark, FiPlus } from "react-icons/fi";
import api from "../../utils/api";
import { resolveImageUrl } from "../../utils/imageUtils";
import Container from "../../components/layout/Container";
import Section from "../../components/layout/Section";
import SearchBar from "../../components/ui/SearchBar";
import Card, { CardContent, CardFooter } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Pagination from "../../components/ui/Pagination";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

const ITEMS_PER_PAGE = 6;

export default function Recipes() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Query parameters
    const initialSearch = searchParams.get("search") || "";
    const initialCategory = searchParams.get("category") || "All";
    const initialCuisine = searchParams.get("cuisine") || "All";
    const initialDifficulty = searchParams.get("difficulty") || "All";
    const initialTime = searchParams.get("time") || "";
    const initialSearchBy = searchParams.get("searchBy") || "all";
    const initialSortBy = searchParams.get("sortBy") || "newest";

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [selectedCuisine, setSelectedCuisine] = useState(initialCuisine);
    const [selectedDifficulty, setSelectedDifficulty] = useState(initialDifficulty);
    const [selectedTime, setSelectedTime] = useState(initialTime);
    const [searchBy, setSearchBy] = useState(initialSearchBy);
    const [sortBy, setSortBy] = useState(initialSortBy);
    const [currentPage, setCurrentPage] = useState(1);
    const [recipes, setRecipes] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // Categories list for filtering
    const categories = ["All", "Breakfast", "Italian", "Mexican", "Thai", "Japanese", "Mediterranean", "American", "Gujarati", "Rajasthani", "Marathi", "South Indian", "Dessert"];
    const cuisines = ["All", "Global", "Indian", "Italian", "Mexican", "Thai", "Chinese", "American"];
    const difficulties = ["All", "Easy", "Medium", "Hard"];
    const timeOptions = [
        { label: "Any Time", value: "" },
        { label: "< 15 Mins", value: "15" },
        { label: "< 30 Mins", value: "30" },
        { label: "< 60 Mins", value: "60" }
    ];

    // Update query inputs when searchParams changes (e.g. from Home page search)
    useEffect(() => {
        setSearchQuery(searchParams.get("search") || "");
        setSelectedCategory(searchParams.get("category") || "All");
        setSearchBy(searchParams.get("searchBy") || "all");
        setSortBy(searchParams.get("sortBy") || "newest");
        setSelectedCuisine(searchParams.get("cuisine") || "All");
        setSelectedDifficulty(searchParams.get("difficulty") || "All");
        setSelectedTime(searchParams.get("time") || "");
        setCurrentPage(1); // Reset page on new parameters
    }, [searchParams]);

    useEffect(() => {
        const fetchRecipes = async () => {
            setIsLoading(true);
            try {
                const params = {
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                };
                if (searchQuery.trim()) {
                    params.search = searchQuery.trim();
                }
                if (selectedCategory !== "All") {
                    params.category = selectedCategory;
                }
                if (selectedCuisine !== "All") {
                    params.cuisine = selectedCuisine;
                }
                if (selectedDifficulty !== "All") {
                    params.difficulty = selectedDifficulty;
                }
                if (selectedTime) {
                    params.time = selectedTime;
                }
                if (searchBy !== "all") {
                    params.searchBy = searchBy;
                }
                if (sortBy !== "newest") {
                    params.sortBy = sortBy;
                }

                const response = await api.get("/recipes", { params });
                if (response.data && response.data.success) {
                    setRecipes(response.data.recipes);
                    setTotalPages(response.data.totalPages);
                }
            } catch (error) {
                console.error("Error fetching recipes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const timer = setTimeout(() => {
            fetchRecipes();
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory, selectedCuisine, selectedDifficulty, selectedTime, searchBy, sortBy, currentPage]);

    // Handle Search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSearchParams((prev) => {
            if (value) prev.set("search", value);
            else prev.delete("search");
            return prev;
        });
        setCurrentPage(1);
    };

    // Handle Search Clear
    const handleSearchClear = () => {
        setSearchQuery("");
        setSearchParams((prev) => {
            prev.delete("search");
            return prev;
        });
        setCurrentPage(1);
    };

    // Handle Category change
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSearchParams((prev) => {
            if (category !== "All") prev.set("category", category);
            else prev.delete("category");
            return prev;
        });
        setCurrentPage(1);
    };

    // Handle SearchBy change
    const handleSearchByChange = (e) => {
        const value = e.target.value;
        setSearchBy(value);
        setSearchParams((prev) => {
            if (value !== "all") prev.set("searchBy", value);
            else prev.delete("searchBy");
            return prev;
        });
        setCurrentPage(1);
    };

    // Handle SortBy change
    const handleSortByChange = (e) => {
        const value = e.target.value;
        setSortBy(value);
        setSearchParams((prev) => {
            if (value !== "newest") prev.set("sortBy", value);
            else prev.delete("sortBy");
            return prev;
        });
        setCurrentPage(1);
    };

    const handleFilterChange = (setter, paramName, value, defaultValue = "All") => {
        setter(value);
        setSearchParams((prev) => {
            if (value !== defaultValue) prev.set(paramName, value);
            else prev.delete(paramName);
            return prev;
        });
        setCurrentPage(1);
    };

    // Reset all filters
    const handleResetFilters = () => {
        setSearchQuery("");
        setSelectedCategory("All");
        setSelectedCuisine("All");
        setSelectedDifficulty("All");
        setSelectedTime("");
        setSearchBy("all");
        setSortBy("newest");
        setSearchParams({});
        setCurrentPage(1);
    };

    // Pagination Logic is server-side
    const paginatedRecipes = recipes;

    return (
        <div className="w-full bg-bg pb-24 font-body selection:bg-primary/30 selection:text-primary-dark">
            {/* Cinematic Hero & Search Hub */}
            <header className="relative w-full pt-32 pb-24 bg-card border-b border-border mb-16 overflow-hidden flex flex-col items-center text-center px-4">
                {/* Massive Animated Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10 animate-pulse"></div>
                
                <Badge variant="primary" className="mb-6 px-4 py-1.5 shadow-md bg-primary-light/50 backdrop-blur-md text-primary font-bold uppercase tracking-widest text-xs border border-primary/20">
                    Explore The World
                </Badge>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-text-h font-heading mb-6 tracking-tight max-w-4xl leading-[1.1] drop-shadow-sm">
                    The Culinary <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Universe</span>
                </h1>
                
                <p className="text-text/70 text-lg md:text-xl leading-relaxed max-w-2xl mb-12">
                    Discover, create, and share extraordinary recipes from professional chefs and passionate home cooks around the globe.
                </p>

                {/* Floating Search Hub */}
                <div className="w-full max-w-4xl glass-card rounded-[2rem] p-3 shadow-2xl border border-border/50 relative z-20 flex flex-col md:flex-row gap-3 items-center backdrop-blur-xl bg-card/80">
                    <div className="flex-1 w-full flex items-center bg-transparent relative">
                        <SearchBar
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onClear={handleSearchClear}
                            placeholder="Search for ingredients, dishes, or chefs..."
                            className="w-full border-none bg-transparent shadow-none text-lg px-4"
                        />
                    </div>
                    
                    <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 border-t md:border-t-0 border-border/50 pt-3 md:pt-0 md:pl-3 md:border-l">
                        <select 
                            value={searchBy}
                            onChange={handleSearchByChange}
                            className="bg-card/50 border-none text-text-h text-sm font-semibold focus:ring-0 cursor-pointer h-14 px-4 rounded-xl hover:bg-card transition-colors outline-none"
                        >
                            <option value="all">Search In: All Fields</option>
                            <option value="title">Search In: Title Only</option>
                            <option value="ingredients">Search In: Ingredients</option>
                        </select>

                        <select 
                            value={sortBy}
                            onChange={handleSortByChange}
                            className="bg-card/50 border-none text-text-h text-sm font-semibold focus:ring-0 cursor-pointer h-14 px-4 rounded-xl hover:bg-card transition-colors outline-none"
                        >
                            <option value="newest">Sort By: Newest</option>
                            <option value="popular">Sort By: Popular (Views)</option>
                            <option value="highest_rated">Sort By: Highest Rated</option>
                            <option value="most_saved">Sort By: Most Saved</option>
                        </select>
                    </div>

                    <Button 
                        variant="primary" 
                        size="md" 
                        className="w-full md:w-auto px-6 rounded-2xl shadow-md hover:shadow-glow font-bold text-sm whitespace-nowrap h-14 hidden md:flex items-center"
                        onClick={() => navigate("/add-recipe")}
                    >
                        <FiPlus size={20} className="mr-1" /> Publish
                    </Button>
                </div>

                {/* Categories Row */}
                <div className="flex flex-wrap gap-3 justify-center mt-8 max-w-4xl relative z-20">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold border whitespace-nowrap transition-all duration-300 transform hover:scale-105
                                ${selectedCategory === cat
                                    ? "bg-text-h border-text-h text-bg shadow-lg shadow-text-h/20"
                                    : "bg-card/50 border-border/50 text-text/70 hover:bg-code-bg hover:text-text-h backdrop-blur-md"
                                }
                            `}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </header>

            {/* Recipes Grid */}
            <Section id="recipes-catalog" className="min-h-[500px] max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
                
                {/* Advanced Filter Sidebar */}
                <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
                    <div className="bg-card border border-border/50 rounded-[1.5rem] p-5 shadow-sm">
                        <h3 className="font-bold text-text-h mb-4">Filters</h3>
                        
                        {/* Difficulty */}
                        <div className="mb-5">
                            <label className="text-xs font-bold text-text/60 uppercase tracking-wider mb-2 block">Difficulty</label>
                            <div className="flex flex-col gap-2">
                                {difficulties.map(diff => (
                                    <label key={diff} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                                        <input 
                                            type="radio" 
                                            name="difficulty" 
                                            checked={selectedDifficulty === diff}
                                            onChange={() => handleFilterChange(setSelectedDifficulty, "difficulty", diff)}
                                            className="accent-primary"
                                        />
                                        {diff}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Cuisine */}
                        <div className="mb-5">
                            <label className="text-xs font-bold text-text/60 uppercase tracking-wider mb-2 block">Cuisine</label>
                            <select 
                                value={selectedCuisine}
                                onChange={(e) => handleFilterChange(setSelectedCuisine, "cuisine", e.target.value)}
                                className="w-full bg-code-bg/30 border border-border rounded-lg p-2 text-sm text-text outline-none focus:border-primary"
                            >
                                {cuisines.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Cooking Time */}
                        <div className="mb-5">
                            <label className="text-xs font-bold text-text/60 uppercase tracking-wider mb-2 block">Cooking Time</label>
                            <select 
                                value={selectedTime}
                                onChange={(e) => handleFilterChange(setSelectedTime, "time", e.target.value, "")}
                                className="w-full bg-code-bg/30 border border-border rounded-lg p-2 text-sm text-text outline-none focus:border-primary"
                            >
                                {timeOptions.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                            </select>
                        </div>

                        <Button variant="outline" size="sm" onClick={handleResetFilters} className="w-full">
                            Reset Filters
                        </Button>
                    </div>
                </aside>

                <div className="flex-1 w-full">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="animate-pulse bg-card rounded-[2rem] border border-border/40 overflow-hidden h-[450px] flex flex-col">
                                <div className="h-64 bg-code-bg/50 w-full"></div>
                                <div className="p-8 flex-1 flex flex-col gap-3">
                                    <div className="h-4 w-1/3 bg-code-bg/80 rounded"></div>
                                    <div className="h-8 w-3/4 bg-code-bg/80 rounded"></div>
                                    <div className="h-12 w-full bg-code-bg/40 rounded mt-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : recipes.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 gap-y-12">
                            {paginatedRecipes.map((recipe, index) => {
                                const authorName = recipe.author && typeof recipe.author === "object" ? recipe.author.name : (recipe.author || "Chef");
                                const authorAvatar = recipe.author && typeof recipe.author === "object" ? recipe.author.avatar : null;
                                const imageUrl = resolveImageUrl(recipe.image);
                                
                                // Create a staggered animation delay based on index
                                const delayClass = index % 3 === 0 ? "delay-0" : index % 3 === 1 ? "delay-100" : "delay-200";

                                return (
                                    <div 
                                        key={recipe._id} 
                                        className={`animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both ${delayClass}`}
                                    >
                                        <Card
                                            className="flex flex-col h-full rounded-[2rem] border border-border/40 hover:border-primary/30 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-3 cursor-pointer transition-all duration-500 group bg-card overflow-hidden"
                                            onClick={() => navigate(`/recipes/${recipe._id}`)}
                                        >
                                            {/* Immersive Header Media */}
                                            <div className="relative h-64 bg-gradient-to-br from-code-bg to-code-bg/50 flex items-center justify-center text-7xl select-none overflow-hidden">
                                                {imageUrl ? (
                                                    <img src={imageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
                                                ) : (
                                                    <span className="group-hover:scale-125 transition-transform duration-500 drop-shadow-xl">{recipe.image || "🍲"}</span>
                                                )}
                                                {/* Gradient Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                                                
                                                <div className="absolute top-5 right-5 z-10">
                                                    <Badge variant="primary" className="shadow-lg backdrop-blur-xl bg-bg/60 border border-border/50 text-text-h px-3 py-1 font-bold">
                                                        {recipe.category}
                                                    </Badge>
                                                </div>
                                                
                                                {/* Quick action buttons floating on image */}
                                                <div className="absolute top-5 left-5 z-10 flex flex-col gap-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                    <button
                                                        className="w-10 h-10 bg-bg/80 backdrop-blur-md border border-border/50 rounded-full flex items-center justify-center text-text/70 hover:text-danger hover:bg-card hover:border-red-200 transition-colors shadow-lg"
                                                        onClick={(e) => e.stopPropagation()}
                                                        aria-label="Add to favorites"
                                                    >
                                                        <FiHeart size={18} />
                                                    </button>
                                                    <button
                                                        className="w-10 h-10 bg-bg/80 backdrop-blur-md border border-border/50 rounded-full flex items-center justify-center text-text/70 hover:text-info hover:bg-card hover:border-blue-200 transition-colors shadow-lg"
                                                        onClick={(e) => e.stopPropagation()}
                                                        aria-label="Bookmark"
                                                    >
                                                        <FiBookmark size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Card Content */}
                                            <CardContent className="flex-1 flex flex-col p-8 pt-6 text-left relative bg-card z-10">
                                                <div className="flex gap-4 items-center text-sm text-text/60 font-bold tracking-wide uppercase mb-3">
                                                    <span className="flex items-center gap-1.5 bg-code-bg px-2.5 py-1 rounded-md"><FiClock size={14} className="text-primary" /> {recipe.cookingTime || recipe.prepTime || 30} Mins</span>
                                                    <span className="text-accent flex items-center gap-1 bg-accent/10 px-2.5 py-1 rounded-md">★ {(recipe.ratingsAverage || 4.5).toFixed(1)}</span>
                                                </div>
                                                
                                                <h3 className="font-heading font-extrabold text-2xl text-text-h m-0 mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                                                    {recipe.title}
                                                </h3>
                                                
                                                <p className="text-base text-text/70 line-clamp-2 leading-relaxed m-0 font-medium">
                                                    {recipe.description}
                                                </p>
                                            </CardContent>

                                            {/* Card Footer */}
                                            <CardFooter className="flex justify-between items-center bg-card px-8 py-5 border-t border-border/30">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={authorName} src={authorAvatar} size="sm" className="ring-2 ring-primary/20" />
                                                    <div>
                                                        <div className="text-[10px] text-text/50 font-bold uppercase tracking-wider mb-0.5">By Chef</div>
                                                        <span className="text-sm font-bold text-text-h block">{authorName}</span>
                                                    </div>
                                                </div>
                                                <div className="text-primary font-bold text-sm flex items-center gap-1 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                    View <span className="text-lg">→</span>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => {
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="mt-10"
                        />
                    </>
                ) : (
                    /* Beautiful Empty State if no recipes match search */
                    <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-card bg-code-bg/10 p-8 max-w-xl mx-auto">
                        <span className="text-6xl mb-4 select-none">🔍</span>
                        <h3 className="text-xl font-bold text-text-h font-heading m-0 mb-2">No Recipes Found</h3>
                        <p className="text-text/60 text-sm max-w-sm leading-relaxed m-0 mb-6">
                            We couldn't find any recipes matching your filters or search query. Try broadening your keywords or resetting filters.
                        </p>
                        <Button variant="primary" size="md" onClick={handleResetFilters} className="font-semibold shadow-md">
                            Clear Search & Filters
                        </Button>
                    </div>
                )}
                </div>
            </Section>
        </div>
    );
}