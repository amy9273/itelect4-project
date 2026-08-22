import type { ApiVet, ApiPet, ApiAppointment, NewAppointment } from "../types/index";

export const API_URL = "http://localhost:3001";

// GET /vets -> whole list
export async function fetchVets(): Promise<ApiVet[]> {
    const res = await fetch(`${API_URL}/vets`);
    if (!res.ok) {
        throw new Error("Could not load veterinarians");
    }
    return res.json();
}

// GET /vets/:id -> single vet
export async function fetchVetById(id: string): Promise<ApiVet> {
    const res = await fetch(`${API_URL}/vets/${id}`);
    if (!res.ok) {
        throw new Error(`Could not load veterinarian #${id}`);
    }
    return res.json();
}

// GET /pets -> whole list
export async function fetchPets(): Promise<ApiPet[]> {
    const res = await fetch(`${API_URL}/pets`);
    if (!res.ok) {
        throw new Error("Could not load pets");
    }
    return res.json();
}

// GET /pets/:id -> single pet
export async function fetchPetById(id: string): Promise<ApiPet> {
    const res = await fetch(`${API_URL}/pets/${id}`);
    if (!res.ok) {
        throw new Error(`Could not load pet #${id}`);
    }
    return res.json();
}

// GET /appointments -> whole list
export async function fetchAppointments(): Promise<ApiAppointment[]> {
    const res = await fetch(`${API_URL}/appointments`);
    if (!res.ok) {
        throw new Error("Could not load appointments");
    }
    return res.json();
}

// POST /appointments -> create new appointment
export async function createAppointment(
    newAppointment: NewAppointment
): Promise<ApiAppointment> {
    const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
    });
    if (!res.ok) {
        throw new Error("Could not schedule the appointment");
    }
    return res.json();
}
