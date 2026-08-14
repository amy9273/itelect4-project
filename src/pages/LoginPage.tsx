import { useState } from "react";
import { useNavigate } from "react-router";
import useAuthStore from "../store/authStore";

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
        <div className="max-w-md mx-auto mt-12 p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-xl shadow-lg space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Sign In
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Access clinic appointments and vet files
                </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-300">
                        Username / Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name to login..."
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 p-3 text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={name.trim() === ""}
                    className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 shadow"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
