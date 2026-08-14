import { useState, useEffect, useRef } from "react";
import type { Appointment } from "../types/index";
import AppointmentCard from "../components/AppointmentCard";
import usePrevious from "../hooks/usePrevious";
import { mockAppointments } from "../data/mockData";

function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const searchInputRef = useRef<HTMLInputElement>(null);
    const previousSearch = usePrevious(searchTerm);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAppointments(mockAppointments);
            setIsLoading(false);
            searchInputRef.current?.focus();
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
    };

    const filteredAppointments = appointments.filter((apt) => {
        const notesText = apt.notes?.toLowerCase() || "";
        const statusText = apt.status.toLowerCase();
        return (
            notesText.includes(searchTerm.toLowerCase()) ||
            statusText.includes(searchTerm.toLowerCase())
        );
    });

    if (isLoading) {
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
                <p className="font-bold text-lg mb-2">Simulated Error State</p>
                <p className="text-sm mb-4">Could not load appointments. Please reset the state.</p>
                <button
                    onClick={() => setIsError(false)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded text-sm transition-colors"
                >
                    Reset Error State
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    Scheduled Appointments
                </h2>
                <button
                    onClick={() => setIsError(true)}
                    className="rounded bg-red-100 dark:bg-red-950/50 px-3 py-1.5 text-sm text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900 transition-colors font-semibold"
                >
                    Simulate Error
                </button>
            </div>

            <div className="space-y-2">
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
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
