import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUserPlus, FiAlertCircle } from "react-icons/fi";
import api from "../../utils/api";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Checkbox from "../../components/ui/Checkbox";
import Toast from "../../components/ui/Toast";

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isToastOpen, setIsToastOpen] = useState(false);
    const [toastMsg, setToastMsg] = useState("");
    const [toastType, setToastType] = useState("success");

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        // Client-side validation
        if (!name.trim()) {
            setErrorMsg("Please enter your name.");
            return;
        }
        if (!email.trim()) {
            setErrorMsg("Please enter your email address.");
            return;
        }
        if (password.length < 6) {
            setErrorMsg("Password must be at least 6 characters.");
            return;
        }
        if (!agreeTerms) {
            setErrorMsg("You must agree to the Terms of Service to continue.");
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post("/auth/register", { name: name.trim(), email: email.trim(), password });
            const { accessToken, user } = response.data;

            login(accessToken, user);

            setToastType("success");
            setToastMsg(`Welcome, Chef ${user.name}! Taking you to your dashboard...`);
            setIsToastOpen(true);

            setTimeout(() => navigate("/dashboard"), 1200);
        } catch (err) {
            const msg = err.response?.data?.message || "Account creation failed. Please try again.";
            setErrorMsg(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full flex flex-col gap-6">
                {/* Branding */}
                <div className="text-center flex flex-col items-center gap-2">
                    <span className="text-5xl select-none">🍳</span>
                    <h2 className="text-3xl font-extrabold text-text-h font-heading m-0">GourmetLab</h2>
                    <p className="text-sm text-text/60 m-0">Create your free chef account to get started</p>
                </div>

                {/* Card Container */}
                <div className="border border-border rounded-card p-8 bg-card shadow-md text-left flex flex-col gap-5">
                    <h1 className="text-xl font-bold text-text-h font-heading m-0">Create Account</h1>

                    {/* Inline Error Message */}
                    {errorMsg && (
                        <div className="flex items-start gap-2 p-3 rounded-button bg-red-50 border border-red-200 text-danger text-sm font-medium">
                            <FiAlertCircle size={16} className="shrink-0 mt-0.5" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="flex flex-col gap-4">
                        {/* Name Input */}
                        <Input
                            label="Your Name"
                            type="text"
                            placeholder="e.g. Julia Child"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrorMsg(""); }}
                            required
                        />

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
                            placeholder="Min. 6 characters"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setErrorMsg(""); }}
                            required
                        />

                        {/* Agree to Terms */}
                        <div className="mt-1 select-none">
                            <Checkbox
                                label="I agree to the Terms of Service & Privacy Policy"
                                checked={agreeTerms}
                                onChange={(e) => { setAgreeTerms(e.target.checked); setErrorMsg(""); }}
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full font-semibold shadow-xs flex items-center justify-center gap-2 mt-2"
                            disabled={isSubmitting}
                        >
                            <FiUserPlus size={18} /> {isSubmitting ? "Creating Account..." : "Create Account"}
                        </Button>
                    </form>

                    {/* Login Redirect */}
                    <div className="text-center border-t border-border pt-4 mt-2">
                        <span className="text-xs text-text/60">
                            Already have an account?{" "}
                            <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
                                Sign In
                            </Link>
                        </span>
                    </div>
                </div>
            </div>

            {/* Success/Error Toast */}
            <Toast
                isOpen={isToastOpen}
                message={toastMsg}
                type={toastType}
                onClose={() => setIsToastOpen(false)}
            />
        </div>
    );
}