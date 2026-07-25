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
    // 1. TYPED STATE (Requirement: at least 2 pieces of state)
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedVet, setSelectedVet] = useState<User | null>(null);

    // 2. TYPED DOM REFERENCE (Requirement: one typed DOM reference)
    const searchInputRef = useRef<HTMLInputElement>(null);

    // 3. CUSTOM HOOKS (Requirement: 2 custom hooks)
    const [showDetails, toggleDetails] = useToggle(false);
    const previousSearch = usePrevious(searchTerm);

    // 4. USE EFFECT (Requirement: load mock data on mount)
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

    // 5. TYPED DOM EVENT HANDLER (Requirement: typed onChange)
    const handleSearchChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        setSearchTerm(e.target.value);
    };

    // Derived state: Filter appointments based on search term
    const filteredAppointments = appointments.filter((apt) => {
        const notesText = apt.notes?.toLowerCase() || "";
        // .toString() prevents TS errors if your status is a numeric enum
        const statusText = apt.status.toString().toLowerCase(); 
        return notesText.includes(searchTerm.toLowerCase()) || 
               statusText.includes(searchTerm.toLowerCase());
    });

    // Early return for loading state
    if (isLoading) {
        return <p style={{ padding: "2rem", textAlign: "center" }}>Loading clinic data...</p>;
    }

    // ===== DYNAMIC UI RENDERING =====
    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "800px", margin: "0 auto" }}>
            <h1>Vet Appointment Dashboard</h1>

            {/* Search Input with Ref and Typed Event */}
            <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search appointments by notes or status..."
                style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
            />
            
            {/* Show previous search term using custom hook */}
            {previousSearch !== undefined && previousSearch !== searchTerm && (
                <p style={{ color: "gray", fontSize: "0.9rem" }}>
                    Previous search: "{previousSearch}"
                </p>
            )}

            {/* Vet Card with Callback Prop */}
            <VetCard vet={mockVet} onSelect={setSelectedVet} />
            {selectedVet && <p style={{ color: "green" }}>Selected Vet: {selectedVet.name}</p>}

            {/* Toggle Button using custom hook */}
            <button 
                onClick={toggleDetails} 
                style={{ marginBottom: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}
            >
                {showDetails ? "Hide" : "Show"} Pet Details
            </button>

            {/* Conditionally render Pet Card using custom hook state */}
            {showDetails && <PetCard pet={mockPet} />}

            {/* Render Filtered Appointments (Requirement: dynamic rendering, not hard-coded) */}
            <h2>Appointments ({filteredAppointments.length})</h2>
            {filteredAppointments.length === 0 ? (
                <p>No appointments found.</p>
            ) : (
                filteredAppointments.map((apt) => (
                    <AppointmentCard key={apt.id} appointment={apt}>
                        <p>Reminder: Please arrive 15 minutes early.</p>
                    </AppointmentCard>
                ))
            )}
        </div>
    );
}

export default App;