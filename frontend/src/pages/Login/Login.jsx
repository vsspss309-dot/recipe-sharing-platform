import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiLogIn, FiAlertCircle } from "react-icons/fi";
import api, { setAccessToken } from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Checkbox from "../../components/ui/Checkbox";
import Toast from "../../components/ui/Toast";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState("success");
    
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!email.trim() || !password) {
            setErrorMsg("Please enter both your email and password.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post("/auth/login", { email: email.trim(), password });
            const { accessToken, user } = response.data;
            
            login(accessToken, user);
            
            setToastType("success");
            setToastMsg(`Welcome back, Chef ${user.name}! Logging you in...`);
            setIsToastOpen(true);
            
            setTimeout(() => {
                navigate("/dashboard");
            }, 1200);
        } catch (err) {
            const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
            setErrorMsg(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full flex flex-col gap-6">
                {/* Branding */}
                <div className="text-center flex flex-col items-center gap-2">
                    <span className="text-5xl select-none">🍳</span>
                    <h2 className="text-3xl font-extrabold text-text-h font-heading m-0">RecipeHub</h2>
                    <p className="text-sm text-text/60 m-0">Sign in to your culinary console</p>
                </div>

                {/* Card Container */}
                <div className="border border-border rounded-card p-8 bg-card shadow-md text-left flex flex-col gap-5">
                    <h1 className="text-xl font-bold text-text-h font-heading m-0">Sign In</h1>

                    {/* Inline Error Message */}
                    {errorMsg && (
                        <div className="flex items-start gap-2 p-3 rounded-button bg-red-50 border border-red-200 text-danger text-sm font-medium">
                            <FiAlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{errorMsg}</span>
                        </div>
                    )}
                    
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        {/* Email Input */}
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="chef@example.com"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); setErrorMsg(""); }}
                            required
                        />

                        {/* Password Input */}
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                            required
                        />

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between mt-1 select-none">
                            <Checkbox
                                label="Remember me"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full font-semibold shadow-xs flex items-center justify-center gap-2 mt-2"
                            disabled={isSubmitting}
                        >
                            <FiLogIn size={18} /> {isSubmitting ? "Signing In..." : "Sign In"}
                        </Button>
                    </form>

                    {/* Register redirect */}
                    <div className="text-center border-t border-border pt-4 mt-2">
                        <span className="text-xs text-text/60">
                            Don't have an account yet?{" "}
                            <Link to="/register" className="font-bold text-primary hover:text-primary-dark transition-colors">
                                Create Account
                            </Link>
                        </span>
                    </div>
                </div>
            </div>

            {/* Success Toast */}
            <Toast
                isOpen={isToastOpen}
                message={toastMsg}
                type={toastType}
                onClose={() => setIsToastOpen(false)}
            />
        </div>
    );
}