import VetCard from "./components/VetCard";
import PetCard from "./components/PetCard";
import AppointmentCard from "./components/AppointmentCard";
import type { User, Pet, Appointment } from "./types/index";
import { AppointmentStatus } from "./types/index";

// Mock Data using GT1 Interfaces
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

const mockAppointment: Appointment = {
    id: 1,
    petId: 101,
    vetId: 1,
    scheduledAt: new Date("2026-07-20T10:00:00"),
    notes: "Annual checkup and vaccinations",
    status: AppointmentStatus.Scheduled,
};

function App() {
    // Typed callback function
    const handleVetSelect = (selectedVet: User): void => {
        console.log(`Selected vet: ${selectedVet.name} (ID: ${selectedVet.id})`);
        alert(`You selected ${selectedVet.name}`);
    };

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>Vet Appointment System Dashboard</h1>
            
            <VetCard vet={mockVet} onSelect={handleVetSelect} />
            
            <PetCard pet={mockPet} />
            
            <AppointmentCard appointment={mockAppointment}>
                <p>Reminder: Please arrive 15 minutes early.</p>
            </AppointmentCard>
        </div>
    );
}

export default App;