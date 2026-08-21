import { NavLink, Outlet } from "react-router";
import useAuthStore from "../store/authStore";
import useUiStore from "../store/uiStore";

function Layout() {
    const isDarkMode = useUiStore((state) => state.isDarkMode);
    const toggleDarkMode = useUiStore((state) => state.toggleDarkMode);
    const userName = useAuthStore((state) => state.userName);
    const logout = useAuthStore((state) => state.logout);

    const base = "rounded px-3 py-1.5 text-sm font-medium transition-colors duration-200";
    const activeLink = `${base} bg-blue-600 text-white shadow-sm`;
    const idleLink = `${base} text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800`;

    const linkClass = ({ isActive }: { isActive: boolean }): string =>
        isActive ? activeLink : idleLink;

    return (
        <div className={isDarkMode ? "dark" : ""}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
                <nav className="flex flex-wrap items-center gap-4 border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 shadow-sm">
                    <span className="mr-4 text-xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
                        Vet Clinic Portal
                    </span>
                    <div className="flex gap-2">
                        <NavLink to="/" end className={linkClass}>
                            Dashboard
                        </NavLink>
                        <NavLink to="/vets" className={linkClass}>
                            Our Vets
                        </NavLink>
                        <NavLink to="/pets" className={linkClass}>
                            My Pets
                        </NavLink>
                        <NavLink to="/appointments" className={linkClass}>
                            Appointments
                        </NavLink>
                    </div>

                    <div className="ml-auto flex items-center gap-4">
                        {userName === null ? (
                            <NavLink to="/login" className={linkClass}>
                                Login
                            </NavLink>
                        ) : (
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                    Hello, {userName}
                                </span>
                                <button
                                    onClick={logout}
                                    className="rounded bg-red-100 dark:bg-red-950/40 px-3 py-1.5 text-sm font-semibold text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                        <button
                            onClick={toggleDarkMode}
                            className="rounded bg-gray-800 px-3 py-1.5 text-sm font-semibold text-white dark:bg-gray-200 dark:text-gray-900 transition-colors hover:bg-gray-700 dark:hover:bg-gray-100"
                        >
                            {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </button>
                    </div>
                </nav>
                <main className="p-6 max-w-6xl mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default Layout;
