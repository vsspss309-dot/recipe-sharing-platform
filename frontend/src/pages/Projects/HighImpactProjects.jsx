import React, { useState, useEffect } from 'react';
import Container from "../../components/layout/Container";
import Section from "../../components/layout/Section";
import Breadcrumb from "../../components/layout/Breadcrumb";
import Skeleton from "../../components/ui/Skeleton";
import Alert from "../../components/ui/Alert";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import { projectApi } from "../../services/projectApi";
import { FiTrendingUp } from "react-icons/fi";

export default function HighImpactProjects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await projectApi.getHighImpactProjects();
                setProjects(response.data || []);
                setError(null);
            } catch (err) {
                console.error("Error fetching projects:", err);
                setError("Failed to load high impact projects. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Generate dummy projects if none exist (for demonstration purposes)
    const displayProjects = projects.length > 0 ? projects : [
        {
            _id: "demo1",
            title: "Global Supply Chain Optimization",
            description: "A transformative project aimed at reducing carbon emissions by 40% across all logistics hubs while improving delivery times.",
            status: "In Progress",
            isHighImpact: true,
            impactScore: 9,
            createdAt: new Date().toISOString(),
            createdBy: { name: "Sarah Connor" }
        },
        {
            _id: "demo2",
            title: "AI Customer Support Agent",
            description: "Deploying a state-of-the-art LLM to handle tier 1 and tier 2 customer inquiries, projected to save $2M annually.",
            status: "Planning",
            isHighImpact: true,
            impactScore: 8,
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
            createdBy: { name: "John Doe" }
        },
        {
            _id: "demo3",
            title: "Renewable Energy Transition",
            description: "Transitioning 100% of our data centers to renewable energy sources by the end of Q4.",
            status: "Completed",
            isHighImpact: true,
            impactScore: 10,
            createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
            createdBy: { name: "Elon Gates" }
        }
    ];

    const filteredProjects = displayProjects.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container className="py-10 text-left min-h-screen bg-bg">
            <Breadcrumb />
            
            <header className="mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-r from-bg via-code-bg/30 to-bg border border-border p-8 shadow-sm">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-4 bg-gradient-to-br from-accent/20 to-accent/5 rounded-2xl border border-accent/20 shadow-inner">
                                <FiTrendingUp className="text-accent text-3xl animate-pulse" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-text-h to-text-h/70 font-heading m-0 tracking-tight">
                                High Impact Projects
                            </h1>
                        </div>
                        <p className="text-text/70 text-lg mt-4 leading-relaxed">
                            Discover our most critical initiatives driving significant value and transformation. These projects have been identified as high-priority with substantial ROI or strategic importance.
                        </p>
                    </div>
                    
                    <div className="w-full md:w-auto min-w-[300px]">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-text/40 group-focus-within:text-accent transition-colors">🔍</span>
                            </div>
                            <input 
                                type="text" 
                                className="w-full bg-bg/50 border border-border/60 text-text rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all shadow-sm backdrop-blur-sm"
                                placeholder="Search projects by title or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <Section id="projects-grid">
                {error && (
                    <div className="mb-8">
                        <Alert title="Connection Error" variant="error">
                            {error}
                        </Alert>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="flex flex-col border border-border rounded-medium bg-code-bg/5 overflow-hidden">
                                <Skeleton variant="rect" height="160px" className="rounded-none" />
                                <div className="p-5 flex flex-col gap-4">
                                    <Skeleton variant="text" width="80%" height="24px" />
                                    <div className="flex flex-col gap-2">
                                        <Skeleton variant="text" width="100%" />
                                        <Skeleton variant="text" width="90%" />
                                        <Skeleton variant="text" width="60%" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {projects.length === 0 && !error && (
                            <div className="mb-8">
                                <Alert title="Demo Data" variant="info">
                                    No actual projects found in the database. Showing demonstration data below.
                                </Alert>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                        {filteredProjects.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <span className="text-6xl mb-4 opacity-50">🔍</span>
                                <h3 className="text-xl font-bold text-text-h mb-2">No projects found</h3>
                                <p className="text-text/60 max-w-md">We couldn't find any projects matching "{searchTerm}". Try adjusting your search keywords.</p>
                            </div>
                        )}
                    </>
                )}
            </Section>
        </Container>
    );
}
