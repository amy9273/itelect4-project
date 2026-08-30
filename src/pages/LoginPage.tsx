import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function LoginPage() {
    const [name, setName] = useState<string>("");
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent): void => {
        e.preventDefault();
        if (name.trim() !== "") {
            login(name);
            navigate("/appointments");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-8 border border-border bg-card rounded-xl shadow-lg space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-foreground">
                    Sign In
                </h2>
                <p className="text-sm text-muted-foreground">
                    Access clinic appointments and vet files
                </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="username">
                        Username / Name
                    </Label>
                    <Input
                        id="username"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name to login..."
                        required
                    />
                </div>

                <Button
                    type="submit"
                    disabled={name.trim() === ""}
                    className="w-full"
                >
                    Login
                </Button>
            </form>
        </div>
    );
}

export default LoginPage;
