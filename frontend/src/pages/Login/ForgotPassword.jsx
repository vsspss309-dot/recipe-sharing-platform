import { useState } from "react";
import { Link } from "react-router-dom";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Mock API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full flex flex-col gap-6">
                <div className="text-center flex flex-col items-center gap-2">
                    <span className="text-5xl select-none">🔐</span>
                    <h2 className="text-3xl font-extrabold text-text-h font-heading m-0">Password Reset</h2>
                    <p className="text-sm text-text/60 m-0">We'll send you instructions to reset it</p>
                </div>

                <div className="border border-border rounded-card p-8 bg-card shadow-md text-left flex flex-col gap-5">
                    {isSubmitted ? (
                        <div className="flex flex-col items-center text-center gap-4 py-4">
                            <FiCheckCircle size={48} className="text-success" />
                            <h3 className="text-xl font-bold text-text-h m-0">Check your email</h3>
                            <p className="text-text/70 text-sm m-0">
                                We've sent a password reset link to <strong>{email}</strong>.
                            </p>
                            <Button variant="outline" className="mt-4 w-full" onClick={() => setIsSubmitted(false)}>
                                Try another email
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <Input
                                label="Email Address"
                                type="email"
                                placeholder="chef@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full font-semibold mt-2"
                                disabled={isSubmitting || !email}
                            >
                                {isSubmitting ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </form>
                    )}
                    
                    <div className="text-center border-t border-border pt-4 mt-2">
                        <Link to="/login" className="text-sm font-bold text-text/60 hover:text-primary transition-colors flex items-center justify-center gap-2">
                            <FiArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
