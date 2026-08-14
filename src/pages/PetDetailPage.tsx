import { useParams, useNavigate } from "react-router";
import PetCard from "../components/PetCard";
import { allPets } from "../data/mockData";

function PetDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // Look up the pet by numeric ID
    const petId = id ? parseInt(id, 10) : NaN;
    const pet = allPets.find((p) => p.id === petId);

    if (!pet || isNaN(petId)) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg text-center text-red-700 dark:text-red-400 shadow-md">
                <h3 className="text-xl font-bold mb-2">Pet Not Found</h3>
                <p className="text-sm mb-4">No pet found with ID "{id}".</p>
                <button
                    onClick={() => navigate("/pets")}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
                >
                    Back to Pets
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Pet Details: {pet.name}
            </h2>
            
            <PetCard pet={pet} variant="default" />

            <div className="flex gap-4">
                <button
                    onClick={() => navigate("/pets")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow transition-colors"
                >
                    &larr; Back to Pets List
                </button>
            </div>
        </div>
    );
}

export default PetDetailPage;
