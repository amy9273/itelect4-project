import { Link } from "react-router";

function NotFoundPage() {
    return (
        <div className="max-w-md mx-auto mt-12 p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-xl shadow-lg text-center space-y-6">
            <h2 className="text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                404
            </h2>
            <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Page Not Found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    The page you are looking for does not exist or has been moved.
                </p>
            </div>
            <Link
                to="/"
                className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow transition-colors"
            >
                Go back to Dashboard
            </Link>
        </div>
    );
}

export default NotFoundPage;
