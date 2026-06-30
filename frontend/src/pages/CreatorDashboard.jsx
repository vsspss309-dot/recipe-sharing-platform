import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaChartLine, FaEye, FaBookmark, FaStar, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CreatorDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [topRecipes, setTopRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [analyticsRes, topRecipesRes] = await Promise.all([
                    api.get('/analytics/dashboard'),
                    api.get('/analytics/top-recipes')
                ]);
                
                setAnalytics(analyticsRes.data.data);
                setTopRecipes(topRecipesRes.data.data);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 403) {
                    setError('Creator Analytics is a Chef-tier exclusive feature.');
                } else {
                    setError('Failed to load dashboard data.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (error) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-6 bg-gray-50">
                <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center max-w-lg w-full">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaLock className="text-orange-500 text-3xl" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Chef Exclusive</h2>
                    <p className="text-gray-500 mb-8">{error}</p>
                    <Link to="/pricing" className="inline-block bg-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-colors shadow-sm hover:shadow-md">
                        Upgrade to Chef Tier
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const statCards = [
        { label: 'Total Views', value: analytics.totalViews, icon: FaEye, color: 'text-blue-500', bg: 'bg-blue-100' },
        { label: 'Total Saves', value: analytics.totalSaves, icon: FaBookmark, color: 'text-green-500', bg: 'bg-green-100' },
        { label: 'Avg Rating', value: analytics.averageRating, icon: FaStar, color: 'text-yellow-500', bg: 'bg-yellow-100' },
        { label: 'Recipes Published', value: analytics.totalRecipes, icon: FaChartLine, color: 'text-purple-500', bg: 'bg-purple-100' }
    ];

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900">Creator Analytics</h1>
                <p className="mt-2 text-gray-500 text-lg">Track the performance of your recipes and audience engagement.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {statCards.map((stat, index) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={stat.label} 
                        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5"
                    >
                        <div className={`w-14 h-14 ${stat.bg} rounded-xl flex items-center justify-center`}>
                            <stat.icon className={`text-2xl ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value.toLocaleString()}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Top Recipes Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-gray-900">Top Performing Recipes</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold w-16">Rank</th>
                                <th className="p-4 font-semibold">Recipe</th>
                                <th className="p-4 font-semibold text-right">Views</th>
                                <th className="p-4 font-semibold text-right">Saves</th>
                                <th className="p-4 font-semibold text-right">Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {topRecipes.map((recipe, index) => (
                                <tr key={recipe._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 text-center font-semibold text-gray-400">#{index + 1}</td>
                                    <td className="p-4">
                                        <Link to={`/recipes/${recipe._id}`} className="flex items-center gap-3 group">
                                            {recipe.image ? (
                                                <img src={recipe.image} alt={recipe.title} className="w-10 h-10 rounded-lg object-cover" />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-lg">🍲</div>
                                            )}
                                            <span className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors">{recipe.title}</span>
                                        </Link>
                                    </td>
                                    <td className="p-4 text-right font-medium text-gray-600">{recipe.viewsCount?.toLocaleString() || 0}</td>
                                    <td className="p-4 text-right font-medium text-gray-600">{recipe.savesCount?.toLocaleString() || 0}</td>
                                    <td className="p-4 text-right font-medium text-gray-600 flex items-center justify-end gap-1">
                                        <FaStar className="text-yellow-400" /> {recipe.ratingsAverage} <span className="text-gray-400 text-xs">({recipe.ratingsCount})</span>
                                    </td>
                                </tr>
                            ))}
                            {topRecipes.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No recipes published yet. 
                                        <Link to="/add-recipe" className="text-orange-500 ml-2 hover:underline">Create your first recipe!</Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CreatorDashboard;
