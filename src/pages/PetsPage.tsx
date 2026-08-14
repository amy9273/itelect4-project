import { Link } from "react-router";
import PetCard from "../components/PetCard";
import useToggle from "../hooks/useToggle";
import { allPets } from "../data/mockData";

function PetsPage() {
    const [showDetails, toggleDetails] = useToggle(true);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Registered Pets
                </h2>
                <button
                    onClick={toggleDetails}
                    className="px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-semibold text-sm transition-colors"
                >
                    {showDetails ? "Hide All Info" : "Show All Info"}
                </button>
            </div>

            {showDetails ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allPets.map((pet) => (
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
