import { Link } from "react-router-dom";
import { FiHome, FiSearch, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
            {/* Background decorative glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[80px] pointer-events-none -z-10"></div>

            {/* Animated 404 */}
            <div className="relative mb-8 select-none">
                <span className="text-[180px] sm:text-[220px] font-black font-heading text-transparent bg-clip-text bg-gradient-to-br from-primary via-accent to-secondary leading-none tracking-tighter opacity-90 animate-pulse" style={{ animationDuration: "3s" }}>
                    404
                </span>
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl sm:text-8xl animate-bounce" style={{ animationDuration: "2s" }}>
                    🍳
                </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text-h font-heading m-0 mb-4 tracking-tight">
                Oops! Recipe Not Found
            </h1>

            {/* Description */}
            <p className="text-text/60 text-lg max-w-md mx-auto leading-relaxed mb-10">
                The page you're looking for doesn't exist or may have been moved. 
                Let's get you back to the kitchen!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                    to="/" 
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-dark transition-all duration-300 text-sm"
                >
                    <FiHome size={18} /> Go Home
                </Link>
                <Link 
                    to="/recipes" 
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-card text-text-h font-bold rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-sm"
                >
                    <FiSearch size={18} /> Browse Recipes
                </Link>
                <button 
                    onClick={() => window.history.back()}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-transparent text-text/70 font-bold rounded-xl hover:text-text-h hover:bg-code-bg transition-all duration-300 text-sm cursor-pointer"
                >
                    <FiArrowLeft size={18} /> Go Back
                </button>
            </div>
        </div>
    );
}