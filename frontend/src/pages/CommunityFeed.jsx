import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaHeart, FaComment, FaClock, FaFire } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CommunityFeed = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                setLoading(true);
                const { data } = await api.get('/recipes/feed');
                setRecipes(data.recipes);
            } catch (err) {
                console.error(err);
                setError('Failed to load your community feed.');
            } finally {
                setLoading(false);
            }
        };

        fetchFeed();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-3">
                        <FaFire className="text-orange-500" /> Community Feed
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">The latest recipes from the chefs you follow.</p>
                </div>

                {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">{error}</div>}

                {recipes.length === 0 && !error ? (
                    <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
                        <div className="text-5xl mb-4">🍳</div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Your feed is quiet</h2>
                        <p className="text-gray-500 mb-6">Follow some chefs to see their latest creations here!</p>
                        <Link to="/" className="inline-block bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors">
                            Explore Recipes
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {recipes.map((recipe, index) => (
                            <motion.article 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={recipe._id} 
                                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <div className="p-4 flex items-center gap-3 border-b border-gray-50">
                                    <div className="w-10 h-10 bg-gradient-to-tr from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                        {recipe.author?.name ? recipe.author.name.charAt(0).toUpperCase() : 'C'}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 leading-tight">{recipe.author?.name || 'Unknown Chef'}</h3>
                                        <span className="text-xs text-gray-500">
                                            {new Date(recipe.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                                
                                <Link to={`/recipes/${recipe._id}`} className="block">
                                    {recipe.image && recipe.image !== '🍲' && recipe.image !== '🤖' ? (
                                        <img src={recipe.image} alt={recipe.title} className="w-full h-80 object-cover" />
                                    ) : (
                                        <div className="w-full h-80 bg-orange-50 flex items-center justify-center text-6xl">
                                            {recipe.image || '🍲'}
                                        </div>
                                    )}
                                </Link>

                                <div className="p-6">
                                    <Link to={`/recipes/${recipe._id}`}>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2 hover:text-orange-500 transition-colors">{recipe.title}</h2>
                                    </Link>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                                    
                                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-50 text-gray-500">
                                        <button className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                            <FaHeart /> <span className="font-medium">{recipe.savesCount || 0}</span>
                                        </button>
                                        <button className="flex items-center gap-2 hover:text-orange-500 transition-colors">
                                            <FaComment /> <span className="font-medium">Discuss</span>
                                        </button>
                                        <div className="flex items-center gap-2 ml-auto text-sm">
                                            <FaClock /> <span>{recipe.prepTime}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommunityFeed;
