import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import type { ApiVet } from "../types/index";
import { fetchVets } from "../api/client";

function VetsPage() {
    const { data: vets, isPending, isError, error } = useQuery<ApiVet[]>({
        queryKey: ["vets"],
        queryFn: fetchVets,
    });

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-pulse text-gray-500 dark:text-gray-400 font-semibold text-lg">
                    Loading veterinarians...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-md mx-auto rounded-lg bg-red-50 dark:bg-red-950/30 p-6 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-center shadow-md">
                <p className="font-bold text-lg mb-2">Error Loading Vets</p>
                <p className="text-sm mb-4">{error.message} -- is json-server running on port 3001?</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Our Veterinarians
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
                Browse our team of professional veterinarians. Click on any vet to view their schedule and contact details.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {vets.map((vet) => (
                    <Link key={vet.id} to={`/vets/${vet.id}`} className="block transition-transform hover:scale-102 hover:shadow-md rounded-lg bg-white dark:bg-gray-800 p-1">
                        <div className="p-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{vet.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Specialist ({vet.role})</p>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-950/20 px-5 py-2 rounded-b-lg border-t border-gray-150 dark:border-gray-800 text-xs text-blue-600 dark:text-blue-400 font-semibold text-right">
                            View Profile &rarr;
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default VetsPage;
