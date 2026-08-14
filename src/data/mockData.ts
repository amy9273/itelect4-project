import type { User, Pet, Appointment } from "../types/index";
import { AppointmentStatus } from "../types/index";

export const mockVet: User = {
    id: 1,
    name: "Dr. Juan dela Cruz",
    email: "juan.vet@example.com",
    role: "vet",
    isActive: true,
};

export const allVets: User[] = [
    mockVet,
    {
        id: 2,
        name: "Dr. Maria Santos",
        email: "maria.vet@example.com",
        role: "vet",
        isActive: true,
    }
];

export const allPets: Pet[] = [
    {
        id: 101,
        name: "Buddy",
        species: "Dog",
        breed: "Golden Retriever",
        ownerId: 5,
    },
    {
        id: 102,
        name: "Max",
        species: "Dog",
        breed: "German Shepherd",
        ownerId: 6,
    },
    {
        id: 103,
        name: "Bella",
        species: "Cat",
        breed: "Siamese",
        ownerId: 7,
    },
    {
        id: 104,
        name: "Luna",
        species: "Cat",
        breed: "Persian",
        ownerId: 8,
    }
];

export const mockAppointments: Appointment[] = [
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
    {
        id: 3,
        petId: 103,
        vetId: 2,
        scheduledAt: new Date("2026-08-01T09:00:00"),
        notes: "Routine checkup",
        status: AppointmentStatus.Scheduled,
    },
    {
        id: 4,
        petId: 104,
        vetId: 2,
        scheduledAt: new Date("2026-08-02T14:00:00"),
        notes: "Ear cleaning",
        status: AppointmentStatus.Cancelled,
    }
];
