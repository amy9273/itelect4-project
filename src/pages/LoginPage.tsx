import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import { loginApi, registerApi } from "../api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
    const [authMode, setAuthMode] = useState<"login" | "register">("login");
    
    // Form fields
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    
    // UI state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const setSession = useAuthStore((state) => state.setSession);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);
        setIsLoading(true);

        try {
            if (authMode === "register") {
                if (!name.trim()) {
                    throw new Error("Full name is required");
                }
                if (password.length < 8) {
                    throw new Error("Password must be at least 8 characters long");
                }
                // Call real registration endpoint
                await registerApi(name.trim(), email.trim(), password);
                
                // Immediately log in with the new credentials
                const loginRes = await loginApi(email.trim(), password);
                setSession(loginRes.token, loginRes.user);
                navigate("/appointments");
            } else {
                // Call real login endpoint
                const loginRes = await loginApi(email.trim(), password);
                setSession(loginRes.token, loginRes.user);
                navigate("/appointments");
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Authentication failed";
            setErrorMsg(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-8 border border-border bg-card rounded-xl shadow-lg space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-foreground">
                    {authMode === "login" ? "Clinic Portal Sign In" : "Create New Account"}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {authMode === "login"
                        ? "Sign in with your email and password to access appointments"
                        : "Register as a pet owner or clinic member"}
                </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 p-1 bg-muted rounded-lg border border-border">
                <button
                    type="button"
                    onClick={() => {
                        setAuthMode("login");
                        setErrorMsg(null);
                    }}
                    className={`py-2 text-sm font-semibold rounded-md transition-all ${
                        authMode === "login"
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Sign In
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setAuthMode("register");
                        setErrorMsg(null);
                    }}
                    className={`py-2 text-sm font-semibold rounded-md transition-all ${
                        authMode === "register"
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Register
                </button>
            </div>

            {/* Notifications */}
            {errorMsg && (
                <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-lg text-sm">
                    {errorMsg}
                </div>
            )}
            {successMsg && (
                <div className="p-3 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 text-green-700 dark:text-green-300 rounded-lg text-sm">
                    {successMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                {authMode === "register" && (
                    <div className="grid gap-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input
                            id="fullname"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Juan Dela Cruz"
                            required
                        />
                    </div>
                )}

                <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. user@example.com"
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={authMode === "register" ? "Minimum 8 characters" : "Enter password"}
                        required
                        minLength={8}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading || !email.trim() || !password.trim()}
                    className="w-full"
                >
                    {isLoading
                        ? "Please wait..."
                        : authMode === "login"
                        ? "Sign In to Portal"
                        : "Create Account & Sign In"}
                </Button>
            </form>
        </div>
    );
}

export default LoginPage;
