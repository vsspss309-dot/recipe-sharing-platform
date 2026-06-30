import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import Card, { CardContent } from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";

export default function Settings() {
    const { user, login } = useAuth(); // Assuming login updates the context if we pass token (or we can just update local user state if context supports it, but AuthContext usually refetches on mount)
    const [formData, setFormData] = useState({
        name: "",
        bio: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                bio: user.bio || ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setSuccessMsg("");
        setErrorMsg("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMsg("");
        setErrorMsg("");

        try {
            const response = await api.put("/users/profile", formData);
            if (response.data && response.data.success) {
                setSuccessMsg("Profile updated successfully!");
                // Optionally trigger a context refresh here if your AuthContext exposes a refresh method
                // For now, the next time they reload they'll see the new name.
            }
        } catch (error) {
            console.error("Profile update error:", error);
            setErrorMsg(error.response?.data?.message || "Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-text-h font-heading mb-2">Account Settings</h1>
                <p className="text-text/70">Update your profile information and preferences.</p>
            </div>

            <Card className="rounded-[2rem] border border-border/40 shadow-sm bg-card overflow-hidden">
                <CardContent className="p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {successMsg && (
                            <div className="bg-success/10 text-success border border-success/20 p-4 rounded-xl text-sm font-medium">
                                {successMsg}
                            </div>
                        )}
                        {errorMsg && (
                            <div className="bg-danger/10 text-danger border border-danger/20 p-4 rounded-xl text-sm font-medium">
                                {errorMsg}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-text-h mb-2 uppercase tracking-wide">
                                Display Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-code-bg/30 border border-border rounded-xl p-4 text-text outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary"
                                placeholder="Your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-text-h mb-2 uppercase tracking-wide">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                disabled
                                className="w-full bg-code-bg/10 border border-border/50 rounded-xl p-4 text-text/50 outline-none cursor-not-allowed"
                                title="Email cannot be changed"
                            />
                            <p className="text-xs text-text/50 mt-2">Email address cannot be changed at this time.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-text-h mb-2 uppercase tracking-wide">
                                Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                                maxLength={150}
                                className="w-full bg-code-bg/30 border border-border rounded-xl p-4 text-text outline-none focus:border-primary transition-colors focus:ring-1 focus:ring-primary resize-none"
                                placeholder="Tell us a little about yourself (max 150 characters)"
                            />
                            <p className="text-xs text-text/50 mt-2 text-right">
                                {formData.bio.length}/150
                            </p>
                        </div>

                        <div className="pt-4 border-t border-border/30 mt-2 flex justify-end">
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="px-8 shadow-md font-bold"
                                disabled={isLoading}
                            >
                                {isLoading ? <Spinner size="sm" /> : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
