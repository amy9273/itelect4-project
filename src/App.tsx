import { useState, useEffect, useRef } from "react";
import type { User, Pet, Appointment } from "./types/index";
import { AppointmentStatus } from "./types/index";

// Import your GT2 Part 1 components
import VetCard from "./components/VetCard";
import PetCard from "./components/PetCard";
import AppointmentCard from "./components/AppointmentCard";

// Import your new custom hooks
import useToggle from "./hooks/useToggle";
import usePrevious from "./hooks/usePrevious";

// ===== MOCK DATA =====
const mockVet: User = {
    id: 1,
    name: "Dr. Juan dela Cruz",
    email: "juan.vet@example.com",
    role: "vet",
    isActive: true,
};

const mockPet: Pet = {
    id: 101,
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    ownerId: 5,
};

// Array of mock appointments to demonstrate list rendering
const mockAppointments: Appointment[] = [
    {
        id: 1,
        petId: 101,
        vetId: 1,
        scheduledAt: new Date("2026-07-25T10:00:00"),
        notes: "Annual checkup and vaccinations",
        status: AppointmentStatus.Scheduled,
    },
    {
        id: 2,
        petId: 102,
        vetId: 1,
        scheduledAt: new Date("2026-07-25T11:30:00"),
        notes: "Nail trimming",
        status: AppointmentStatus.Completed,
    },
];

// ===== MAIN APP COMPONENT =====
function App() {
    // 1. TYPED STATE
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedVet, setSelectedVet] = useState<User | null>(null);

    // 2. TYPED DOM REFERENCE
    const searchInputRef = useRef<HTMLInputElement>(null);

    // 3. CUSTOM HOOKS
    const [showDetails, toggleDetails] = useToggle(false);
    const [isDarkMode, toggleDarkMode] = useToggle(false);
    const previousSearch = usePrevious(searchTerm);

    // 4. USE EFFECT (load mock data on mount)
    useEffect(() => {
        // Simulate a 500ms API fetch delay
        const timer = setTimeout(() => {
            setAppointments(mockAppointments);
            setIsLoading(false);
            
            // Focus the search input once data is loaded
            searchInputRef.current?.focus();
        }, 500);

        // Cleanup function
        return () => clearTimeout(timer);
    }, []);

    // 5. TYPED DOM EVENT HANDLER
    const handleSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setSearchTerm(e.target.value);
    };

    // Derived state: Filter appointments based on search term
    const filteredAppointments = appointments.filter((apt) => {
        const notesText = apt.notes?.toLowerCase() || "";
        const statusText = apt.status.toLowerCase(); 
        return notesText.includes(searchTerm.toLowerCase()) || 
               statusText.includes(searchTerm.toLowerCase());
    });

    // Early return for loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="animate-pulse p-6 text-gray-500 dark:text-gray-400 font-semibold text-lg">
                    Loading clinic data...
                </div>
            </div>
        );
    }

    // Early return for error state
    if (isError) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="m-6 max-w-md w-full rounded-lg bg-red-50 dark:bg-red-950/30 p-4 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-center shadow-md">
                    <p className="font-semibold mb-2">Error Occurred</p>
                    <p className="text-sm">Could not load clinic data. Please try refreshing the page.</p>
                </div>
            </div>
        );
    }

    // ===== DYNAMIC UI RENDERING =====
    return (
        <div className={isDarkMode ? "dark" : ""}>
            <div className="min-h-screen bg-gray-50 p-6 dark:bg-gray-900 text-gray-850 transition-colors duration-200">
                <div className="max-w-6xl mx-auto">
                    {/* Header Controls */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            Vet Appointment Dashboard
                        </h1>
                        <div className="flex gap-2">
                            <button 
                                onClick={toggleDarkMode} 
                                className="rounded bg-gray-800 px-3 py-1.5 text-sm text-white dark:bg-gray-200 dark:text-gray-900 transition-colors hover:bg-gray-700 dark:hover:bg-gray-100 font-medium"
                            >
                                {isDarkMode ? "Light Mode" : "Dark Mode"}
                            </button>
                            <button 
                                onClick={() => setIsError(true)} 
                                className="rounded bg-red-100 dark:bg-red-950/50 px-3 py-1.5 text-sm text-red-700 dark:text-red-400 transition-colors hover:bg-red-200 dark:hover:bg-red-900/50 font-medium"
                            >
                                Simulate Error
                            </button>
                        </div>
                    </div>

                    {/* Search Input with Ref and Typed Event */}
                    <div className="mb-6">
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search appointments by notes or status..."
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-gray-950 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        
                        {/* Show previous search term using custom hook */}
                        {previousSearch !== undefined && previousSearch !== searchTerm && (
                            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1.5 italic">
                                Previous search: "{previousSearch}"
                            </p>
                        )}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Column 1: Vet Card & Details */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Vet Information</h2>
                            <VetCard vet={mockVet} onSelect={setSelectedVet} />
                            {selectedVet && (
                                <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/50 text-green-800 dark:text-green-300 rounded-lg text-sm font-medium">
                                    Selected Vet: {selectedVet.name}
                                </div>
                            )}
                        </div>

                        {/* Column 2: Pet Details Toggle */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pet Details</h2>
                                <button 
                                    onClick={toggleDetails} 
                                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded text-sm font-semibold transition-colors"
                                >
                                    {showDetails ? "Hide" : "Show"}
                                </button>
                            </div>
                            
                            {showDetails ? (
                                <div className="space-y-4">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">Showing default and compact variants:</p>
                                    {/* Default Variant */}
                                    <PetCard pet={mockPet} variant="default" />
                                    {/* Compact Variant */}
                                    <PetCard pet={mockPet} variant="compact" />
                                </div>
                            ) : (
                                <div className="p-5 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-center text-gray-500 dark:text-gray-400 text-sm">
                                    Click Show to load pet cards.
                                </div>
                            )}
                        </div>

                        {/* Column 3: Appointments List */}
                        <div className="md:col-span-1 space-y-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Appointments ({filteredAppointments.length})
                            </h2>
                            {filteredAppointments.length === 0 ? (
                                <div className="p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-center text-gray-500 dark:text-gray-400 text-sm">
                                    No appointments found.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredAppointments.map((apt) => (
                                        <AppointmentCard key={apt.id} appointment={apt}>
                                            <p className="font-semibold">Reminder: Please arrive 15 minutes early.</p>
                                        </AppointmentCard>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;