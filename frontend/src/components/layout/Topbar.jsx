import { FiBell, FiSearch } from "react-icons/fi";
import Avatar from "../ui/Avatar";

export default function Topbar({ title = "Dashboard", user = {} }) {
    return (
        <header className="h-20 bg-card border-b border-border/50 flex items-center justify-between px-6 md:px-8 z-10 shadow-sm shrink-0 pl-16 md:pl-8">
            <h2 className="text-xl font-bold text-text-h font-heading m-0 tracking-tight">{title}</h2>
            
            <div className="flex items-center gap-4 md:gap-6">
                {/* Search (Mock) */}
                <div className="hidden md:flex items-center gap-2 bg-code-bg/50 px-3 py-1.5 rounded-full border border-border focus-within:border-primary/50 transition-colors">
                    <FiSearch className="text-text/40" size={16} />
                    <input type="text" placeholder="Search..." className="bg-transparent border-none text-sm outline-none w-32 focus:w-48 transition-all" />
                </div>

                <button className="relative p-2 text-text/60 hover:text-primary hover:bg-primary-light rounded-full transition-colors" aria-label="Notifications">
                    <FiBell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-card"></span>
                </button>
                
                <div className="flex items-center gap-3 pl-4 border-l border-border/50">
                    <Avatar name={user.name || "User"} src={user.avatar} size="sm" className="shadow-sm" />
                    <span className="hidden md:block text-sm font-bold text-text-h">{user.name || "Chef"}</span>
                </div>
            </div>
        </header>
    );
}
