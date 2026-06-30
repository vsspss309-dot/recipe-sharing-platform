import { useState } from "react";
import { FiSave, FiSettings } from "react-icons/fi";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
        siteName: "RecipeHub",
        allowRegistrations: true,
        maintenanceMode: false,
        requireEmailVerification: false
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            alert("Settings saved successfully!");
        }, 800);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl">
            <div className="mb-8 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <FiSettings size={24} />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-text-h font-heading">Global Settings</h2>
                    <p className="text-text/60">Configure core platform behaviors and features.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="bg-card rounded-2xl border border-border/50 shadow-sm p-6 space-y-8">
                
                {/* General Settings */}
                <div>
                    <h3 className="text-lg font-bold text-text-h mb-4 border-b border-border pb-2">General</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-text/80 mb-2">Platform Name</label>
                            <input
                                type="text"
                                value={settings.siteName}
                                onChange={e => setSettings({...settings, siteName: e.target.value})}
                                className="w-full max-w-md bg-code-bg border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Security & Access */}
                <div>
                    <h3 className="text-lg font-bold text-text-h mb-4 border-b border-border pb-2">Security & Access</h3>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.allowRegistrations ? 'bg-primary' : 'bg-border'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.allowRegistrations ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={settings.allowRegistrations}
                                onChange={e => setSettings({...settings, allowRegistrations: e.target.checked})}
                            />
                            <div>
                                <div className="font-bold text-sm text-text-h group-hover:text-primary transition-colors">Allow New Registrations</div>
                                <div className="text-xs text-text/60">Enable or disable new user signups.</div>
                            </div>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.requireEmailVerification ? 'bg-primary' : 'bg-border'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={settings.requireEmailVerification}
                                onChange={e => setSettings({...settings, requireEmailVerification: e.target.checked})}
                            />
                            <div>
                                <div className="font-bold text-sm text-text-h group-hover:text-primary transition-colors">Require Email Verification</div>
                                <div className="text-xs text-text/60">Users must verify their email before posting recipes.</div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* System */}
                <div>
                    <h3 className="text-lg font-bold text-danger mb-4 border-b border-border pb-2">Danger Zone</h3>
                    <div className="space-y-4">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${settings.maintenanceMode ? 'bg-danger' : 'bg-border'}`}>
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
                            </div>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={settings.maintenanceMode}
                                onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
                            />
                            <div>
                                <div className="font-bold text-sm text-danger group-hover:text-red-600 transition-colors">Maintenance Mode</div>
                                <div className="text-xs text-text/60">Disables the site for non-admins. Use with caution.</div>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="pt-4 border-t border-border flex justify-end">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors ${
                            isSaving ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                    >
                        <FiSave />
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
