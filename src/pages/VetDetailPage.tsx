import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import type { ApiVet } from "../types/index";
import { fetchVetById } from "../api/client";

function VetDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: vet, isPending, isError, error } = useQuery<ApiVet>({
        queryKey: ["vets", id],
        queryFn: () => fetchVetById(id!),
        enabled: id !== undefined,
    });

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-pulse text-gray-500 dark:text-gray-400 font-semibold text-lg">
                    Loading veterinarian profile...
                </div>
            </div>
        );
    }

    if (isError || !vet) {
        return (
            <div className="max-w-md mx-auto mt-8 p-6 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-lg text-center text-red-700 dark:text-red-400 shadow-md">
                <h3 className="text-xl font-bold mb-2">Veterinarian Not Found</h3>
                <p className="text-sm mb-4">{error?.message || `No veterinarian found with ID "${id}".`}</p>
                <button
                    onClick={() => navigate("/vets")}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
                >
                    Back to Vets List
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Vet Profile: {vet.name}
            </h2>
            
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:bg-gray-800 dark:border-gray-700 space-y-3">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{vet.name}</h3>
                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2">
                    <p className="text-sm"><strong className="text-gray-500">Email:</strong> {vet.email}</p>
                    <p className="text-sm"><strong className="text-gray-500">Role:</strong> Specialist ({vet.role})</p>
                    <p className="text-sm"><strong className="text-gray-500">Status:</strong> {vet.isActive ? "Accepting Patients" : "On Leave"}</p>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => navigate("/vets")}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded shadow transition-colors"
                >
                    &larr; Back to Vets List
                </button>
            </div>
        </div>
    );
}

export default VetDetailPage;
