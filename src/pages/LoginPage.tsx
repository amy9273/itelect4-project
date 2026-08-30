import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const demoOwners = [
    { id: 5, name: "Juan Dela Cruz", email: "juan.owner@example.com", pet: "Buddy (Dog)" },
    { id: 6, name: "Maria Clara", email: "maria.clara@example.com", pet: "Max (Dog)" },
    { id: 7, name: "Crisostomo Ibarra", email: "ibarra@example.com", pet: "Bella (Cat)" },
    { id: 8, name: "Elias Santos", email: "elias@example.com", pet: "Luna (Cat)" },
];

const demoVets = [
    { id: 1, name: "Dr. Juan dela Cruz", email: "juan.vet@example.com", role: "vet" as const },
    { id: 2, name: "Dr. Maria Santos", email: "maria.vet@example.com", role: "vet" as const },
];

function LoginPage() {
    const [loginType, setLoginType] = useState<"owner" | "vet">("owner");
    const [name, setName] = useState<string>("Juan Dela Cruz");
    const [selectedUserId, setSelectedUserId] = useState<number>(5);
    const [selectedVetId, setSelectedVetId] = useState<number | null>(null);

    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent): void => {
        e.preventDefault();
        if (name.trim() !== "") {
            if (loginType === "vet") {
                login(name, selectedVetId || 1, "vet", selectedVetId || 1);
            } else {
                login(name, selectedUserId, "owner");
            }
            navigate("/appointments");
        }
    };

    const handleOwnerSelect = (user: typeof demoOwners[0]) => {
        setName(user.name);
        setSelectedUserId(user.id);
    };

    const handleVetSelect = (vet: typeof demoVets[0]) => {
        setName(vet.name);
        setSelectedVetId(vet.id);
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-8 border border-border bg-card rounded-xl shadow-lg space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-foreground">
                    Clinic Portal Sign In
                </h2>
                <p className="text-sm text-muted-foreground">
                    Sign in to access your appointments and clinic dashboard
                </p>
            </div>

            {/* Portal Switch Tabs */}
            <div className="grid grid-cols-2 p-1 bg-muted rounded-lg border border-border">
                <button
                    type="button"
                    onClick={() => {
                        setLoginType("owner");
                        setName(demoOwners[0].name);
                        setSelectedUserId(demoOwners[0].id);
                        setSelectedVetId(null);
                    }}
                    className={`py-2 text-sm font-semibold rounded-md transition-all ${
                        loginType === "owner"
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Pet Owner
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setLoginType("vet");
                        setName(demoVets[0].name);
                        setSelectedVetId(demoVets[0].id);
                    }}
                    className={`py-2 text-sm font-semibold rounded-md transition-all ${
                        loginType === "vet"
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                    Veterinarian
                </button>
            </div>

            {/* QUICK SELECTION FOR PET OWNER */}
            {loginType === "owner" && (
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">
                        Quick Select Pet Owner:
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                        {demoOwners.map((user) => (
                            <button
                                key={user.id}
                                type="button"
                                onClick={() => handleOwnerSelect(user)}
                                className={`p-2.5 text-left border rounded-lg text-xs transition-colors ${
                                    selectedUserId === user.id && name === user.name
                                        ? "border-primary bg-primary/10 font-semibold"
                                        : "border-border hover:bg-muted"
                                }`}
                            >
                                <p className="font-bold text-foreground">{user.name}</p>
                                <p className="text-muted-foreground text-[10px]">Pet: {user.pet}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* QUICK SELECTION FOR VET */}
            {loginType === "vet" && (
                <div className="space-y-2">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase">
                        Quick Select Doctor Account:
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                        {demoVets.map((vet) => (
                            <button
                                key={vet.id}
                                type="button"
                                onClick={() => handleVetSelect(vet)}
                                className={`p-3 text-left border rounded-lg text-xs transition-colors ${
                                    selectedVetId === vet.id && name === vet.name
                                        ? "border-blue-500 bg-blue-500/10 font-semibold"
                                        : "border-border hover:bg-muted"
                                }`}
                            >
                                <p className="font-bold text-foreground">{vet.name}</p>
                                <p className="text-muted-foreground text-[10px]">Staff Vet (ID #{vet.id})</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 pt-2">
                <div className="grid gap-2">
                    <Label htmlFor="username">
                        {loginType === "vet" ? "Doctor Name" : "Owner Name"}
                    </Label>
                    <Input
                        id="username"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name or click above..."
                        required
                    />
                </div>

                <Button
                    type="submit"
                    disabled={name.trim() === ""}
                    className="w-full"
                >
                    {loginType === "vet" ? "Sign In to Doctor Portal" : "Sign In as Pet Owner"}
                </Button>
            </form>
        </div>
    );
}

export default LoginPage;
