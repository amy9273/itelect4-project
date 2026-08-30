import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import PetCard from "../components/PetCard";
import useToggle from "../hooks/useToggle";
import useAuthStore from "../store/authStore";
import type { ApiPet } from "../types/index";
import { fetchPets } from "../api/client";

function PetsPage() {
    const [showDetails, toggleDetails] = useToggle(true);
    const userId = useAuthStore((state) => state.userId);
    const userName = useAuthStore((state) => state.userName);

    const { data: pets, isPending, isError, error } = useQuery<ApiPet[]>({
        queryKey: ["pets"],
        queryFn: fetchPets,
    });

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-pulse text-gray-500 dark:text-gray-400 font-semibold text-lg">
                    Loading pets...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-md mx-auto rounded-lg bg-red-50 dark:bg-red-950/30 p-6 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-center shadow-md">
                <p className="font-bold text-lg mb-2">Error Loading Pets</p>
                <p className="text-sm mb-4">{error.message} -- is json-server running on port 3001?</p>
            </div>
        );
    }

    const myPets = pets.filter((pet) => userId ? Number(pet.ownerId) === Number(userId) : true);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                        {userName ? `${userName}'s Pets` : "Registered Pets"}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {myPets.length > 0
                            ? `Showing ${myPets.length} pet(s) registered under your account.`
                            : "No pets registered under your account."}
                    </p>
                </div>
                <button
                    onClick={toggleDetails}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-semibold text-sm transition-colors"
                >
                    {showDetails ? "Hide All Info" : "Show All Info"}
                </button>
            </div>

            {showDetails ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myPets.map((pet) => (
                        <Link key={pet.id} to={`/pets/${pet.id}`} className="block transition-transform hover:scale-102 hover:shadow-md rounded-lg">
                            <PetCard pet={pet} variant="default" />
                            <div className="bg-blue-50 dark:bg-blue-950/20 px-5 py-2 rounded-b-lg border-t border-gray-150 dark:border-gray-800 text-xs text-blue-600 dark:text-blue-400 font-semibold text-right">
                                View Details &rarr;
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-500 dark:text-gray-400">
                    Pet profiles are hidden. Click "Show All Info" to reveal pet cards.
                </div>
            )}
        </div>
    );
}

export default PetsPage;
