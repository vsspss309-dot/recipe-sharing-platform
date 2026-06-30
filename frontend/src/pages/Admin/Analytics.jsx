import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const dummyData = [
    { name: 'Mon', users: 40, recipes: 24 },
    { name: 'Tue', users: 30, recipes: 13 },
    { name: 'Wed', users: 20, recipes: 98 },
    { name: 'Thu', users: 27, recipes: 39 },
    { name: 'Fri', users: 18, recipes: 48 },
    { name: 'Sat', users: 23, recipes: 38 },
    { name: 'Sun', users: 34, recipes: 43 },
];

export default function AdminAnalytics() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-text-h font-heading">Analytics Dashboard</h2>
                <p className="text-text/60">System growth and engagement metrics over time.</p>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 mb-8 h-96">
                <h3 className="text-lg font-bold text-text-h mb-6">User & Recipe Growth (7 Days)</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={dummyData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorRecipes" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#f3f4f6' }}
                            itemStyle={{ color: '#f3f4f6' }}
                        />
                        <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                        <Area type="monotone" dataKey="recipes" stroke="#10b981" fillOpacity={1} fill="url(#colorRecipes)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-text-h mb-4">Top Categories</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Breakfast</span>
                            <span className="text-sm font-bold text-primary">342 recipes</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Desserts</span>
                            <span className="text-sm font-bold text-primary">289 recipes</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold">Dinner</span>
                            <span className="text-sm font-bold text-primary">156 recipes</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-text-h mb-4">Most Active Users</h3>
                    <div className="space-y-4 text-sm font-semibold">
                        <p className="text-text/50 italic">Activity tracking is currently collecting data. Come back later.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
