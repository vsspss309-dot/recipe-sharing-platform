import React from 'react';
import Card, { CardContent, CardFooter } from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Avatar from "../../components/ui/Avatar";
import { FiClock, FiStar, FiTrendingUp } from "react-icons/fi";

export default function ProjectCard({ project }) {
    const { title, description, status, isHighImpact, impactScore, createdBy, createdAt } = project;
    
    // Format date
    const date = new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

    return (
        <Card className={`flex flex-col relative transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group ${isHighImpact ? 'ring-2 ring-accent shadow-lg shadow-accent/20' : ''}`}>
            {isHighImpact && (
                <div className="absolute -top-3 -right-3 z-10">
                    <Badge variant="warning" className="shadow-md flex items-center gap-1 px-3 py-1 bg-accent text-bg font-bold animate-bounce">
                        <FiTrendingUp /> High Impact
                    </Badge>
                </div>
            )}
            
            <div className="relative h-40 bg-gradient-to-br from-code-bg/70 to-code-bg flex items-center justify-center text-text/30 font-bold overflow-hidden rounded-t-medium group-hover:opacity-90 transition-opacity">
                {/* Abstract visualization or placeholder */}
                <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')]"></div>
                <span className="text-5xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">🚀</span>
                <div className="absolute bottom-3 left-3 backdrop-blur-md bg-bg/30 rounded-full p-1">
                    <Badge variant={status === 'Completed' ? 'success' : status === 'In Progress' ? 'primary' : 'secondary'}>
                        {status}
                    </Badge>
                </div>
                {/* Hover overlay with button */}
                <div className="absolute inset-0 bg-bg/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                    <button className="px-6 py-2 bg-primary text-white rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                        View Details
                    </button>
                </div>
            </div>
            
            <CardContent className="flex-1 flex flex-col gap-3 pt-5 relative">
                <div className="flex justify-between items-start">
                    <h3 className="font-heading font-bold text-xl m-0 text-text-h truncate pr-2 group-hover:text-primary transition-colors duration-200" title={title}>
                        {title}
                    </h3>
                </div>
                
                <p className="text-sm text-text/80 line-clamp-3 leading-relaxed flex-grow">
                    {description}
                </p>

                {impactScore && (
                    <div className="mt-2">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold text-text-h">Impact Target</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-accent">
                                <FiStar className="fill-accent" /> {impactScore}/10
                            </span>
                        </div>
                        <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-accent h-2 rounded-full" 
                                style={{ width: `${(impactScore / 10) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}
                
                <div className="flex gap-4 items-center text-xs text-text/60 font-medium mt-2">
                    <span className="flex items-center gap-1"><FiClock /> {date}</span>
                </div>
            </CardContent>
            
            <CardFooter className="flex justify-between items-center bg-code-bg/5 border-t border-border/50 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <Avatar name={createdBy?.name || "Unknown"} size="sm" />
                    <span className="text-xs font-bold text-text-h">{createdBy?.name || "Unknown"}</span>
                </div>
            </CardFooter>
        </Card>
    );
}
