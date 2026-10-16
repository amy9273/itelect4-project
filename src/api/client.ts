import type { ApiVet, ApiPet, ApiAppointment, NewAppointment, NewPet, User } from "../types/index";

// Read API URL from Vite env or fallback to local backend API
const rawApiUrl = (import.meta.env.VITE_API_URL as string) || "http://localhost:4000/api";
export const API_URL = rawApiUrl.replace(/\/+$/, "");

export interface AuthResponse {
    token: string;
    user: User;
}

// Request helper that handles JSON, errors, and auto-attaches JWT token from auth storage
export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${cleanEndpoint}`;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
    };

    // Auto-read token from persisted Zustand store in localStorage
    try {
        const storedAuth = localStorage.getItem("itelect4-auth");
        if (storedAuth) {
            const parsed = JSON.parse(storedAuth);
            const token = parsed?.state?.token;
            if (token && !headers["Authorization"]) {
                headers["Authorization"] = `Bearer ${token}`;
            }
        }
    } catch {
        // ignore parse errors
    }

    const res = await fetch(url, { ...options, headers });

    if (!res.ok) {
        let errorMsg = `HTTP ${res.status}: ${res.statusText}`;
        try {
            const errorData = await res.json();
            if (errorData.message) {
                errorMsg = errorData.message;
            } else if (Array.isArray(errorData.errors)) {
                errorMsg = errorData.errors.join(", ");
            }
        } catch {
            // body was not json
        }
        throw new Error(errorMsg);
    }

    if (res.status === 204) {
        return {} as T;
    }

    return res.json();
}

// ===== PUBLIC RESOURCES (VETS & PETS) =====

// GET /vets -> whole list
export async function fetchVets(): Promise<ApiVet[]> {
    return apiRequest<ApiVet[]>("/vets");
}

// GET /vets/:id -> single vet
export async function fetchVetById(id: string): Promise<ApiVet> {
    return apiRequest<ApiVet>(`/vets/${id}`);
}

// GET /pets -> whole list
export async function fetchPets(): Promise<ApiPet[]> {
    return apiRequest<ApiPet[]>("/pets");
}

// GET /pets/:id -> single pet
export async function fetchPetById(id: string): Promise<ApiPet> {
    return apiRequest<ApiPet>(`/pets/${id}`);
}

// POST /pets -> create new pet
export async function createPet(newPet: NewPet): Promise<ApiPet> {
    const currentPets = await fetchPets().catch(() => []);
    const numericIds = currentPets
        .map((p) => Number(p.id))
        .filter((id) => !isNaN(id));
    const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 101;

    return apiRequest<ApiPet>("/pets", {
        method: "POST",
        body: JSON.stringify({
            ...newPet,
            id: nextId,
        }),
    });
}

// ===== PROTECTED RESOURCES (APPOINTMENTS) =====

// GET /appointments -> user's appointments (returns empty array if unauthenticated)
export async function fetchAppointments(): Promise<ApiAppointment[]> {
    try {
        const storedAuth = localStorage.getItem("itelect4-auth");
        if (!storedAuth) return [];
        const parsed = JSON.parse(storedAuth);
        if (!parsed?.state?.token) return [];

        return await apiRequest<ApiAppointment[]>("/appointments");
    } catch {
        return [];
    }
}

// POST /appointments -> create new appointment
export async function createAppointment(
    newAppointment: NewAppointment
): Promise<ApiAppointment> {
    return apiRequest<ApiAppointment>("/appointments", {
        method: "POST",
        body: JSON.stringify(newAppointment),
    });
}

// PATCH /appointments/:id -> update appointment status or details
export async function updateAppointmentStatus(
    id: string,
    status: string,
    notes?: string
): Promise<ApiAppointment> {
    const payload: { status: string; notes?: string } = { status };
    if (notes !== undefined) payload.notes = notes;

    return apiRequest<ApiAppointment>(`/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
}

// ===== AUTH (REGISTER & LOGIN) =====

export async function loginApi(
    email: string,
    password: string
): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export async function registerApi(
    name: string,
    email: string,
    password: string
): Promise<User> {
    return apiRequest<User>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });
}
