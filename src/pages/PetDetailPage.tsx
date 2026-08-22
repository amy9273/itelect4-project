import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import PetCard from "../components/PetCard";
import type { ApiPet } from "../types/index";
import { fetchPetById } from "../api/client";

function PetDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: pet, isPending, isError, error } = useQuery<ApiPet>({
        queryKey: ["pets", id],
        queryFn: () => fetchPetById(id!),
        enabled: id !== undefined,
    });

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-pulse text-gray-500 dark:text-gray-400 font-semibold text-lg">
                    Loading pet details...
                </div>
            </div>
        );
    }

    if (isError || !pet) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg text-center text-red-700 dark:text-red-400 shadow-md">
                <h3 className="text-xl font-bold mb-2">Pet Not Found</h3>
                <p className="text-sm mb-4">{error?.message || `No pet found with ID "${id}".`}</p>
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
