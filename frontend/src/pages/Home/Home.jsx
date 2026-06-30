import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiClock, FiHeart, FiBookmark, FiSearch, FiChevronRight, FiCheckCircle, FiStar, FiZap, FiGlobe } from "react-icons/fi";
import api from "../../utils/api";
import { resolveImageUrl } from "../../utils/imageUtils";
import Button from "../../components/ui/Button";
import Card, { CardContent, CardFooter } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import Container from "../../components/layout/Container";
import Section from "../../components/layout/Section";

export default function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [latestRecipes, setLatestRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const [trendingRes, latestRes] = await Promise.all([
                    api.get("/recipes/trending"),
                    api.get("/recipes/latest")
                ]);
                
                if (trendingRes.data?.success) setTrendingRecipes(trendingRes.data.recipes);
                if (latestRes.data?.success) setLatestRecipes(latestRes.data.recipes.slice(0, 4)); // Only show 4 latest on home
            } catch (error) {
                console.error("Error fetching homepage recipes:", error);
            }
        };
        fetchRecipes();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/recipes?search=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            navigate("/recipes");
        }
    };

    const handleCategoryClick = (category) => {
        navigate(`/recipes?category=${encodeURIComponent(category)}`);
    };

    return (
        <div className="w-full flex flex-col bg-bg">
            {/* HERO SECTION */}
            <section className="relative w-full pt-20 pb-24 lg:pt-32 lg:pb-36 overflow-hidden flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 border-b border-border">
                {/* Background effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
                
                <Badge variant="primary" className="mb-6 px-4 py-1.5 font-bold uppercase tracking-widest text-xs glass border-primary/30">
                    🚀 The Ultimate Culinary Platform
                </Badge>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-h font-heading leading-[1.1] max-w-4xl mx-auto mb-6">
                    Cook Like a Master Chef. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent drop-shadow-sm">Scale Your Recipes.</span>
                </h1>
                
                <p className="text-text/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-body mb-10">
                    RecipeHub is the all-in-one SaaS platform for professional chefs and home cooks to discover, manage, and share world-class recipes globally.
                </p>
                
                {/* Search Form */}
                <form onSubmit={handleSearchSubmit} className="w-full max-w-lg mx-auto flex items-center gap-2 glass-card p-2 rounded-2xl border-border focus-within:border-primary/50 shadow-lg transition-all mb-8 relative z-10">
                    <div className="flex items-center pl-4 text-text/50">
                        <FiSearch size={22} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Search ingredients, dishes, or cuisines..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full border-none focus:outline-none text-text text-base py-3 px-2 bg-transparent"
                    />
                    <Button type="submit" variant="primary" size="md" className="px-6 shrink-0 rounded-xl font-bold shadow-md hover:shadow-glow transition-all">
                        Explore Now
                    </Button>
                </form>

                {/* Popular Tags */}
                <div className="flex flex-wrap justify-center items-center gap-3">
                    <span className="text-sm font-semibold text-text/50">Trending Cuisines:</span>
                    {["Italian", "Gujarati", "Rajasthani", "Marathi", "South Indian"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className="px-4 py-1.5 rounded-full text-xs font-bold bg-code-bg/50 hover:bg-primary-light hover:text-primary border border-border hover:border-primary/30 cursor-pointer transition-all backdrop-blur-sm"
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-h font-heading mb-4">Why Choose RecipeHub?</h2>
                    <p className="text-text/60 max-w-2xl mx-auto text-lg">Everything you need to organize your culinary life in one powerful platform.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="glass-card p-8 rounded-card text-left transition-smooth hover:-translate-y-2 hover:shadow-2xl">
                        <div className="w-14 h-14 bg-primary-light text-primary rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <FiGlobe size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-text-h mb-3 font-heading">Global Catalogue</h3>
                        <p className="text-text/70 leading-relaxed">Access thousands of recipes from across the globe, categorized perfectly for instant searchability.</p>
                    </div>
                    {/* Feature 2 */}
                    <div className="glass-card p-8 rounded-card text-left transition-smooth hover:-translate-y-2 hover:shadow-2xl">
                        <div className="w-14 h-14 bg-accent/20 text-accent rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <FiZap size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-text-h mb-3 font-heading">High Impact Tracking</h3>
                        <p className="text-text/70 leading-relaxed">Track metrics and impact scores for major culinary projects to maximize ROI and operational efficiency.</p>
                    </div>
                    {/* Feature 3 */}
                    <div className="glass-card p-8 rounded-card text-left transition-smooth hover:-translate-y-2 hover:shadow-2xl">
                        <div className="w-14 h-14 bg-secondary/20 text-secondary rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <FiBookmark size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-text-h mb-3 font-heading">Personalized Notebook</h3>
                        <p className="text-text/70 leading-relaxed">Save, edit, and curate your own digital cookbook securely stored in the cloud.</p>
                    </div>
                </div>
            </section>

            {/* TRENDING RECIPES SECTION */}
            <section className="py-20 bg-code-bg/30 border-y border-border px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-text-h font-heading m-0 mb-2">Trending Recipes 🔥</h2>
                            <p className="text-text/60 m-0 text-lg">The most viewed and liked creations by our community this week.</p>
                        </div>
                        <Link to="/recipes?sortBy=popular" className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors bg-primary-light px-4 py-2 rounded-full">
                            Explore All Trending <FiChevronRight />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {trendingRecipes.slice(0, 5).map((recipe) => {
                            const authorName = recipe.author && typeof recipe.author === "object" ? recipe.author.name : (recipe.author || "Chef");
                            const authorAvatar = recipe.author && typeof recipe.author === "object" ? recipe.author.avatar : null;
                            const imageUrl = resolveImageUrl(recipe.image);
                            return (
                                <Card key={recipe._id} className="flex flex-col h-full hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-300 group" onClick={() => navigate(`/recipes/${recipe._id}`)}>
                                    {/* Card Media */}
                                    <div className="relative h-56 bg-gradient-to-br from-code-bg to-code-bg/50 flex items-center justify-center text-6xl select-none overflow-hidden rounded-t-card">
                                        {imageUrl ? (
                                            <img src={imageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <span className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{recipe.image || "🍲"}</span>
                                        )}
                                        <div className="absolute top-4 right-4 z-10">
                                            <Badge variant="primary" className="shadow-md backdrop-blur-md bg-bg/80">{recipe.category}</Badge>
                                        </div>
                                    </div>
                                    
                                    {/* Card Body */}
                                    <CardContent className="flex-1 flex flex-col gap-3 p-6 text-left relative bg-card">
                                        <h3 className="font-heading font-bold text-xl text-text-h m-0 line-clamp-1 group-hover:text-primary transition-colors">
                                            {recipe.title}
                                        </h3>
                                        <div className="flex gap-4 items-center text-sm text-text/60 font-semibold mb-1">
                                            <span className="flex items-center gap-1.5"><FiClock /> {recipe.cookingTime || recipe.prepTime || 30} M</span>
                                            <span className="text-accent flex items-center gap-1"><FiStar className="fill-accent"/> {(recipe.ratingsAverage || 4.5).toFixed(1)}</span>
                                        </div>
                                        <p className="text-sm text-text/70 line-clamp-2 leading-relaxed m-0">
                                            {recipe.description}
                                        </p>
                                    </CardContent>

                                    {/* Card Footer */}
                                    <CardFooter className="flex justify-between items-center bg-code-bg/30 px-6 py-4 border-t border-border">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={authorName} src={authorAvatar} size="sm" />
                                            <span className="text-sm font-bold text-text-h">{authorName}</span>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button className="p-2 bg-card border border-border rounded-full hover:bg-red-50 hover:text-danger hover:border-red-200 transition-colors shadow-sm"><FiHeart size={16} /></button>
                                            <button className="p-2 bg-card border border-border rounded-full hover:bg-blue-50 hover:text-info hover:border-blue-200 transition-colors shadow-sm"><FiBookmark size={16} /></button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* LATEST RECIPES SECTION */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-text-h font-heading m-0 mb-2">Fresh Out The Oven 🕒</h2>
                        <p className="text-text/60 m-0 text-lg">The latest culinary creations published by our chefs.</p>
                    </div>
                    <Link to="/recipes?sortBy=newest" className="flex items-center gap-1 text-sm font-bold text-primary hover:text-primary-dark transition-colors bg-primary-light px-4 py-2 rounded-full">
                        View All Latest <FiChevronRight />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {latestRecipes.map((recipe) => {
                        const authorName = recipe.author && typeof recipe.author === "object" ? recipe.author.name : (recipe.author || "Chef");
                        const authorAvatar = recipe.author && typeof recipe.author === "object" ? recipe.author.avatar : null;
                        const imageUrl = resolveImageUrl(recipe.image);
                        return (
                            <Card key={recipe._id} className="flex flex-col h-full hover:shadow-2xl hover:-translate-y-2 cursor-pointer transition-all duration-300 group" onClick={() => navigate(`/recipes/${recipe._id}`)}>
                                {/* Card Media */}
                                <div className="relative h-48 bg-gradient-to-br from-code-bg to-code-bg/50 flex items-center justify-center text-5xl select-none overflow-hidden rounded-t-card">
                                    {imageUrl ? (
                                        <img src={imageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <span className="group-hover:scale-110 transition-transform duration-300 drop-shadow-md">{recipe.image || "🍲"}</span>
                                    )}
                                </div>
                                {/* Card Body */}
                                <CardContent className="flex-1 flex flex-col gap-2 p-5 text-left relative bg-card">
                                    <h3 className="font-heading font-bold text-lg text-text-h m-0 line-clamp-1 group-hover:text-primary transition-colors">
                                        {recipe.title}
                                    </h3>
                                    <div className="flex gap-3 items-center text-xs text-text/60 font-semibold mb-1">
                                        <span className="flex items-center gap-1"><FiClock /> {recipe.cookingTime || recipe.prepTime || 30} M</span>
                                        <Badge variant="outline" className="text-[10px] py-0.5">{recipe.difficulty || "Medium"}</Badge>
                                    </div>
                                </CardContent>
                                {/* Card Footer */}
                                <CardFooter className="flex justify-between items-center bg-code-bg/30 px-5 py-3 border-t border-border">
                                    <div className="flex items-center gap-2">
                                        <Avatar name={authorName} src={authorAvatar} size="sm" className="w-6 h-6 text-[10px]" />
                                        <span className="text-xs font-bold text-text-h">{authorName}</span>
                                    </div>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-text-h font-heading mb-16">Trusted by Top Culinary Experts</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    <div className="glass-card p-8 rounded-card relative mt-6">
                        <div className="absolute -top-6 left-8"><Avatar name="Gordon R" size="lg" className="border-4 border-bg shadow-md"/></div>
                        <div className="flex text-accent mb-4 mt-6"><FiStar className="fill-accent"/><FiStar className="fill-accent"/><FiStar className="fill-accent"/><FiStar className="fill-accent"/><FiStar className="fill-accent"/></div>
                        <p className="text-text/80 leading-relaxed italic mb-4">"RecipeHub transformed how I organize my menu ideas. The platform is blazing fast and visually stunning. Absolutely essential for any serious chef."</p>
                        <p className="font-bold text-text-h">Gordon R. - Executive Chef</p>
                    </div>
                    <div className="glass-card p-8 rounded-card relative mt-6 border-primary/30">
                        <div className="absolute -top-6 left-8"><Avatar name="Julia C" size="lg" className="border-4 border-bg shadow-md"/></div>
                        <div className="flex text-accent mb-4 mt-6"><FiStar className="fill-accent"/><FiStar className="fill-accent"/><FiStar className="fill-accent"/><FiStar className="fill-accent"/><FiStar className="fill-accent"/></div>
                        <p className="text-text/80 leading-relaxed italic mb-4">"The High Impact Projects tracker helped us deploy our new seasonal menu 2 weeks ahead of schedule. The UX is top-notch."</p>
                        <p className="font-bold text-text-h">Julia C. - Restaurant Owner</p>
                    </div>
                    <div className="glass-card p-8 rounded-card relative mt-6">
                        <div className="absolute -top-6 left-8"><Avatar name="Jamie O" size="lg" className="border-4 border-bg shadow-md"/></div>
                        <div className="flex text-accent mb-4 mt-6"><FiStar className="fill-accent"/><FiStar className="fill-accent"/><FiStar className="fill-accent"/><FiStar className="fill-accent"/><FiStar className="fill-accent"/></div>
                        <p className="text-text/80 leading-relaxed italic mb-4">"Finally, a digital cookbook that looks as good as the food it describes. Navigating through regional dishes is a breeze."</p>
                        <p className="font-bold text-text-h">Jamie O. - Culinary Blogger</p>
                    </div>
                </div>
            </section>

            {/* PRICING SECTION (MOCK) */}
            <section className="py-24 bg-gradient-to-b from-bg to-code-bg/50 border-t border-border px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-text-h font-heading mb-4">Simple, Transparent Pricing</h2>
                    <p className="text-text/60 max-w-2xl mx-auto text-lg mb-16">Start for free, upgrade when you need to collaborate with your team.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
                        {/* Hobby */}
                        <div className="bg-card p-8 rounded-card border border-border flex flex-col hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-bold text-text-h mb-2">Hobby Cook</h3>
                            <p className="text-text/60 mb-6 text-sm">For personal recipe tracking.</p>
                            <div className="mb-6"><span className="text-4xl font-extrabold text-text-h">$0</span><span className="text-text/60">/mo</span></div>
                            <ul className="flex flex-col gap-3 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-text/80"><FiCheckCircle className="text-secondary shrink-0"/> Up to 50 Recipes</li>
                                <li className="flex items-center gap-3 text-text/80"><FiCheckCircle className="text-secondary shrink-0"/> Basic Search Filters</li>
                                <li className="flex items-center gap-3 text-text/80"><FiCheckCircle className="text-secondary shrink-0"/> Community Support</li>
                            </ul>
                            <Button variant="outline" className="w-full">Get Started</Button>
                        </div>
                        {/* Pro */}
                        <div className="bg-card p-8 rounded-card border-2 border-primary relative flex flex-col shadow-xl transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase">Most Popular</div>
                            <h3 className="text-xl font-bold text-text-h mb-2">Pro Chef</h3>
                            <p className="text-text/60 mb-6 text-sm">For independent professionals.</p>
                            <div className="mb-6"><span className="text-4xl font-extrabold text-text-h">$12</span><span className="text-text/60">/mo</span></div>
                            <ul className="flex flex-col gap-3 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-text/80"><FiCheckCircle className="text-secondary shrink-0"/> Unlimited Recipes</li>
                                <li className="flex items-center gap-3 text-text/80"><FiCheckCircle className="text-secondary shrink-0"/> High Impact Dashboard</li>
                                <li className="flex items-center gap-3 text-text/80"><FiCheckCircle className="text-secondary shrink-0"/> Advanced Analytics</li>
                                <li className="flex items-center gap-3 text-text/80"><FiCheckCircle className="text-secondary shrink-0"/> Priority Support</li>
                            </ul>
                            <Button variant="primary" className="w-full shadow-md hover:shadow-glow">Upgrade to Pro</Button>
                        </div>
                        {/* Enterprise */}
                        <div className="bg-card p-8 rounded-card border border-border flex flex-col hover:shadow-xl transition-shadow">
                            <h3 className="text-xl font-bold text-text-h mb-2">Restaurant Team</h3>
                            <p className="text-text/60 mb-6 text-sm">For full kitchen operations.</p>
                            <div className="mb-6"><span className="text-4xl font-extrabold text-text-h">$49</span><span className="text-text/60">/mo</span></div>
                            <ul className="flex flex-col gap-3 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-text/80"><FiCheckCircle className="text-secondary shrink-0"/> Everything in Pro</li>
                                <li className="flex items-center gap-3 text-text/80"><FiCheckCircle className="text-secondary shrink-0"/> 10 Team Members</li>
                                <li className="flex items-center gap-3 text-text/80"><FiCheckCircle className="text-secondary shrink-0"/> Role-Based Access</li>
                                <li className="flex items-center gap-3 text-text/80"><FiCheckCircle className="text-secondary shrink-0"/> Dedicated Account Manager</li>
                            </ul>
                            <Button variant="outline" className="w-full">Contact Sales</Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}