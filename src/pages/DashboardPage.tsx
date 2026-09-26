import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { ApiVet, ApiPet, ApiAppointment } from "../types/index";
import VetCard from "../components/VetCard";
import { fetchVets, fetchPets, fetchAppointments } from "../api/client";

function DashboardPage() {
    const [selectedVet, setSelectedVet] = useState<ApiVet | null>(null);

    const { data: vets, isPending: isVetsPending, isError: isVetsError, error: vetsError } = useQuery<ApiVet[]>({
        queryKey: ["vets"],
        queryFn: fetchVets,
    });

    const { data: pets } = useQuery<ApiPet[]>({
        queryKey: ["pets"],
        queryFn: fetchPets,
    });

    const { data: appointments } = useQuery<ApiAppointment[]>({
        queryKey: ["appointments"],
        queryFn: fetchAppointments,
    });

    const featuredVet = vets && vets.length > 0 ? vets[0] : null;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Vet Appointment Dashboard
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        Featured Veterinarian
                    </h3>

                    {isVetsPending && (
                        <div className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-lg animate-pulse text-gray-500 dark:text-gray-400 text-sm">
                            Loading featured veterinarian...
                        </div>
                    )}

                    {isVetsError && (
                        <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 rounded-lg text-sm">
                            Failed to load veterinarian details: {vetsError?.message}
                        </div>
                    )}

                    {featuredVet && (
                        <VetCard vet={featuredVet} onSelect={(vet) => setSelectedVet(vet as ApiVet)} />
                    )}
                    
                    {selectedVet && (
                        <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 text-green-800 dark:text-green-300 rounded-lg text-sm font-semibold shadow-sm">
                            Selected Vet: {selectedVet.name} ({selectedVet.email})
                        </div>
                    )}
                </div>

                <div className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-lg shadow-sm space-y-4">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                        Clinic Overview
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Welcome to the Vet Clinic Portal. Use the navigation links above to manage pets, check scheduled appointments, or log in to access clinical details.
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/40 text-center">
                            <span className="block text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {vets ? vets.length : 0}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Active Vets</span>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-100 dark:border-purple-900/40 text-center">
                            <span className="block text-2xl font-bold text-purple-600 dark:text-purple-400">
                                {pets ? pets.length : 0}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Registered Pets</span>
                        </div>
                        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/40 text-center col-span-2 sm:col-span-1">
                            <span className="block text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {appointments ? appointments.length : 0}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Appointments</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
