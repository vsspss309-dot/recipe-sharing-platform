import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiInstagram, FiHeart, FiLinkedin } from "react-icons/fi";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-card border-t border-border mt-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
                <div className="md:w-1/3">
                    <Link to="/" className="flex items-center gap-2 mb-4 group">
                        <span className="text-2xl drop-shadow-sm group-hover:scale-110 transition-transform">🍳</span>
                        <span className="text-2xl font-extrabold text-text-h font-heading tracking-tight">RecipeHub</span>
                    </Link>
                    <p className="text-text/70 text-sm leading-relaxed mb-6">
                        The premium SaaS platform for chefs and cooking enthusiasts to organize, scale, and share culinary creations globally.
                    </p>
                    <div className="flex items-center gap-4 text-text/50">
                        <a href="#" className="hover:text-primary transition-colors p-2 bg-code-bg rounded-full hover:bg-primary-light"><FiGithub size={18} /></a>
                        <a href="#" className="hover:text-info transition-colors p-2 bg-code-bg rounded-full hover:bg-blue-50"><FiTwitter size={18} /></a>
                        <a href="#" className="hover:text-pink-500 transition-colors p-2 bg-code-bg rounded-full hover:bg-pink-50"><FiInstagram size={18} /></a>
                        <a href="#" className="hover:text-blue-600 transition-colors p-2 bg-code-bg rounded-full hover:bg-blue-50"><FiLinkedin size={18} /></a>
                    </div>
                </div>

                <div className="flex gap-16">
                    <div>
                        <h4 className="font-bold text-text-h mb-4 font-heading tracking-wide uppercase text-sm">Product</h4>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="/" className="text-text/70 hover:text-primary text-sm font-medium transition-colors">Home</Link></li>
                            <li><Link to="/recipes" className="text-text/70 hover:text-primary text-sm font-medium transition-colors">Global Catalogue</Link></li>
                            <li><Link to="/recipes?category=Gujarati" className="text-text/70 hover:text-primary text-sm font-medium transition-colors">Regional Cuisines</Link></li>
                            <li><Link to="/pricing" className="text-text/70 hover:text-primary text-sm font-medium transition-colors">Pricing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-text-h mb-4 font-heading tracking-wide uppercase text-sm">Workspace</h4>
                        <ul className="flex flex-col gap-3">
                            <li><Link to="/dashboard" className="text-text/70 hover:text-primary text-sm font-medium transition-colors">Dashboard Panel</Link></li>
                            <li><Link to="/profile" className="text-text/70 hover:text-primary text-sm font-medium transition-colors">Account Settings</Link></li>
                            <li><a href="#" className="text-text/70 hover:text-primary text-sm font-medium transition-colors">Team Access</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-text/50">
                <p>&copy; {currentYear} RecipeHub Inc. All rights reserved.</p>
                <p className="flex items-center gap-1.5">
                    Crafted with <FiHeart className="text-danger animate-pulse" /> for culinary excellence.
                </p>
            </div>
        </footer>
    );
}
