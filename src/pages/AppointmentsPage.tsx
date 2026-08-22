import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiAppointment } from "../types/index";
import { AppointmentStatus } from "../types/index";
import AppointmentCard from "../components/AppointmentCard";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/uiStore";
import { fetchAppointments, createAppointment } from "../api/client";

function AppointmentsPage() {
    const [petId, setPetId] = useState<string>("101");
    const [vetId, setVetId] = useState<string>("1");
    const [notes, setNotes] = useState<string>("");

    const searchTerm = useUiStore((state) => state.searchTerm);
    const setSearchTerm = useUiStore((state) => state.setSearchTerm);
    const previousSearch = usePrevious(searchTerm);

    const queryClient = useQueryClient();

    // 1. READ -- useQuery hook fetching real appointments from json-server
    const { data: appointments, isPending, isError, error } = useQuery<ApiAppointment[]>({
        queryKey: ["appointments"],
        queryFn: fetchAppointments,
    });

    // 2. WRITE -- useMutation hook that POSTs to json-server and invalidates query on success
    const addAppointmentMutation = useMutation({
        mutationFn: createAppointment,
        onSuccess: () => {
            // Invalidate the cache to trigger a background refetch
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            setNotes("");
        },
    });

    const handleAddAppointment = (e: React.FormEvent): void => {
        e.preventDefault();
        if (!petId || !vetId) return;

        addAppointmentMutation.mutate({
            petId: parseInt(petId, 10),
            vetId: parseInt(vetId, 10),
            scheduledAt: new Date().toISOString(),
            notes: notes.trim() || undefined,
            status: AppointmentStatus.Scheduled,
        });
    };

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-pulse text-gray-500 dark:text-gray-400 font-semibold text-lg">
                    Loading appointments...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-md mx-auto rounded-lg bg-red-50 dark:bg-red-950/30 p-6 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-center shadow-md">
                <p className="font-bold text-lg mb-2">Error Loading Appointments</p>
                <p className="text-sm mb-4">{error.message} -- is json-server running on port 3001?</p>
            </div>
        );
    }

    const filteredAppointments = appointments.filter((apt) => {
        const notesText = apt.notes?.toLowerCase() || "";
        const statusText = apt.status.toLowerCase();
        return (
            notesText.includes(searchTerm.toLowerCase()) ||
            statusText.includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Scheduled Appointments
                </h2>
            </div>

            {/* Appointment Booking Form (triggers useMutation) */}
            <div className="p-5 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-xl shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Book New Appointment
                </h3>
                <form onSubmit={handleAddAppointment} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Pet ID
                        </label>
                        <input
                            type="number"
                            value={petId}
                            onChange={(e) => setPetId(e.target.value)}
                            placeholder="e.g. 101"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 text-sm text-gray-900 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Vet ID
                        </label>
                        <input
                            type="number"
                            value={vetId}
                            onChange={(e) => setVetId(e.target.value)}
                            placeholder="e.g. 1"
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 text-sm text-gray-900 dark:text-white"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                            Appointment Notes
                        </label>
                        <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g. General checkup..."
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 text-sm text-gray-900 dark:text-white"
                        />
                    </div>
                    <div className="sm:col-span-3 flex justify-end">
                        <button
                            type="submit"
                            disabled={addAppointmentMutation.isPending}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400 shadow-sm"
                        >
                            {addAppointmentMutation.isPending ? "Scheduling..." : "Schedule Appointment"}
                        </button>
                    </div>
                </form>
                {addAppointmentMutation.isError && (
                    <p className="text-sm text-red-600 dark:text-red-400">
                        {addAppointmentMutation.error.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search appointments by notes or status (Scheduled, Completed, Cancelled)..."
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-800 bg-white dark:bg-gray-950 p-3 text-gray-950 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                {previousSearch !== undefined && previousSearch !== searchTerm && (
                    <p className="text-gray-500 dark:text-gray-400 text-xs italic">
                        Previous search: "{previousSearch}"
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAppointments.length === 0 ? (
                    <div className="col-span-2 p-8 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-lg text-center text-gray-500 dark:text-gray-400">
                        No appointments found.
                    </div>
                ) : (
                    filteredAppointments.map((apt) => (
                        <AppointmentCard key={apt.id} appointment={apt}>
                            <p className="font-semibold">Reminder: Please arrive 15 minutes before slot.</p>
                        </AppointmentCard>
                    ))
                )}
            </div>
        </div>
    );
}

export default AppointmentsPage;
