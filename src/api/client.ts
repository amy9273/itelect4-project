import type { ApiVet, ApiPet, ApiAppointment, NewAppointment, NewPet } from "../types/index";

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

// POST /pets -> create new pet with sequential integer ID
export async function createPet(newPet: NewPet): Promise<ApiPet> {
    const currentPets = await fetchPets();
    const numericIds = currentPets
        .map((p) => Number(p.id))
        .filter((id) => !isNaN(id));
    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 101;

    const res = await fetch(`${API_URL}/pets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...newPet,
            id: String(nextId),
        }),
    });
    if (!res.ok) {
        throw new Error("Could not register pet");
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

// POST /appointments -> create new appointment with sequential integer ID
export async function createAppointment(
    newAppointment: NewAppointment
): Promise<ApiAppointment> {
    const currentAppointments = await fetchAppointments();
    const numericIds = currentAppointments
        .map((a) => Number(a.id))
        .filter((id) => !isNaN(id));
    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 1;

    const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...newAppointment,
            id: String(nextId),
        }),
    });
    if (!res.ok) {
        throw new Error("Could not schedule the appointment");
    }
    return res.json();
}

// PATCH /appointments/:id -> update appointment status or details
export async function updateAppointmentStatus(
    id: string,
    status: string,
    notes?: string
): Promise<ApiAppointment> {
    const payload: { status: string; notes?: string } = { status };
    if (notes !== undefined) payload.notes = notes;

    const res = await fetch(`${API_URL}/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        throw new Error("Could not update appointment status");
    }
    return res.json();
}
