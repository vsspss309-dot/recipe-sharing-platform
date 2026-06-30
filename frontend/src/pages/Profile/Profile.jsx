import { useState, useEffect } from "react";
import { FiUser, FiMail, FiAward, FiSettings, FiCheckCircle } from "react-icons/fi";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Switch from "../../components/ui/Switch";
import Toast from "../../components/ui/Toast";
import Spinner from "../../components/ui/Spinner";

export default function Profile() {
    const { user, updateAuthUser } = useAuth();
    
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        bio: "",
        newsletter: true,
        darkMode: false
    });

    const [recipesCount, setRecipesCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState("success");

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            try {
                // Load user data from auth context
                if (user) {
                    setProfile({
                        name: user.name || "",
                        email: user.email || "",
                        bio: user.bio || "",
                        newsletter: user.newsletter ?? true,
                        darkMode: user.darkMode ?? false
                    });
                }

                // Load recipe count for this user
                if (user?._id) {
                    const recipesRes = await api.get("/recipes", { params: { author: user._id, limit: 1 } });
                    if (recipesRes.data?.success) {
                        setRecipesCount(recipesRes.data.totalRecipes || recipesRes.data.recipes?.length || 0);
                    }
                }
            } catch (error) {
                console.error("Failed to load profile data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadProfile();
    }, [user]);

    const handleChange = (field, val) => {
        setProfile(prev => ({
            ...prev,
            [field]: val
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const response = await api.put("/users/profile", {
                name: profile.name,
                bio: profile.bio
            });
            
            if (response.data?.success && response.data?.user) {
                updateAuthUser(response.data.user);
            }
            
            setToastType("success");
            setToastMsg("Profile updated successfully!");
            setIsToastOpen(true);
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to update profile.";
            setToastType("error");
            setToastMsg(msg);
            setIsToastOpen(true);
        } finally {
            setIsSaving(false);
        }
    };

    const initials = profile.name
        ? profile.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    if (isLoading) {
        return (
            <div className="dashboard-content-card flex items-center justify-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="dashboard-content-card">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-border text-left">
                <h1 className="text-3xl font-extrabold text-text-h font-heading m-0 mb-1">Chef Profile</h1>
                <p className="text-text/60 text-sm m-0">View kitchen performance, edit account bio parameters, and toggle settings.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Side: Avatar Card and Stats */}
                <div className="md:col-span-1 flex flex-col gap-6 text-left">
                    <div className="border border-border rounded-card p-6 bg-card shadow-xs text-center flex flex-col items-center">
                        {/* Custom Large Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-orange-400 border-4 border-white flex items-center justify-center text-white text-3xl font-bold font-heading select-none shadow-md mb-4">
                            {initials}
                        </div>
                        <h2 className="text-xl font-bold text-text-h font-heading m-0 mb-1">{profile.name || "Chef"}</h2>
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary-light text-primary border border-primary/10 mb-4 uppercase tracking-wider">
                            {user?.role === "admin" ? "Admin Chef" : "Home Chef"}
                        </span>

                        <p className="text-sm text-text/70 leading-relaxed m-0 mb-4">
                            {profile.bio || "No bio added yet. Tell the community about your cooking passion!"}
                        </p>

                        <p className="text-xs text-text/60 leading-relaxed italic m-0">
                            "Laughter is brightest where food is best."
                        </p>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="border border-border rounded-card p-5 bg-code-bg/10 flex flex-col gap-4">
                        <h3 className="font-heading font-bold text-sm text-text-h uppercase tracking-wider m-0 flex items-center gap-1.5">
                            <FiAward className="text-primary" /> Culinary Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-4 text-center mt-2">
                            <div className="bg-card border border-border rounded-medium p-3">
                                <span className="text-2xl font-extrabold text-primary font-heading">{recipesCount}</span>
                                <span className="text-[10px] text-text/50 font-bold block uppercase mt-0.5">Dishes</span>
                            </div>
                            <div className="bg-card border border-border rounded-medium p-3">
                                <span className="text-2xl font-extrabold text-secondary font-heading">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en", { month: "short", year: "2-digit" }) : "—"}
                                </span>
                                <span className="text-[10px] text-text/50 font-bold block uppercase mt-0.5">Joined</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Profile Settings Form */}
                <div className="md:col-span-2 text-left">
                    <form onSubmit={handleSave} className="border border-border rounded-card p-6 bg-card shadow-xs flex flex-col gap-5">
                        <h3 className="font-heading font-bold text-lg text-text-h m-0 flex items-center gap-2">
                            <FiSettings className="text-primary" /> Profile Parameters
                        </h3>

                        {/* Name Input */}
                        <Input 
                            label="Profile Name"
                            value={profile.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            placeholder="Your chef name"
                            required
                        />

                        {/* Email Input (read-only) */}
                        <Input 
                            label="Email Address"
                            type="email"
                            value={profile.email}
                            placeholder="chef@recipehub.com"
                            disabled
                        />

                        {/* Bio Textarea */}
                        <Textarea 
                            label="Short Biography"
                            value={profile.bio}
                            onChange={(e) => handleChange("bio", e.target.value)}
                            placeholder="Tell the community about your cooking styles..."
                            maxLength={300}
                        />

                        {/* Preference Toggle Switches */}
                        <div className="flex flex-col gap-4 border-t border-border pt-4">
                            <h4 className="font-heading font-bold text-sm text-text-h m-0 mb-1">Preferences</h4>
                            <Switch 
                                label="Receive daily newsletters and cooking tips"
                                checked={profile.newsletter}
                                onChange={(e) => handleChange("newsletter", e.target.checked)}
                            />
                            <Switch 
                                label="Enable dark mode dashboard rendering"
                                checked={profile.darkMode}
                                onChange={(e) => handleChange("darkMode", e.target.checked)}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="border-t border-border pt-4 mt-2 flex justify-end">
                            <Button 
                                type="submit" 
                                variant="primary" 
                                size="md" 
                                className="font-semibold shadow-xs flex items-center gap-1.5"
                                disabled={isSaving}
                            >
                                <FiCheckCircle size={16} /> {isSaving ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Toast feedback */}
            <Toast 
                isOpen={isToastOpen}
                message={toastMsg}
                type={toastType}
                onClose={() => setIsToastOpen(false)}
            />
        </div>
    );
}