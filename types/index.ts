// ===== TYPE ALIASES =====
export type StringOrNumber = string | number;
export type ID = number | string;

// ===== INTERFACES =====
// Entity 1: User (with role field for Module 3 auth)
export interface User {
    id: number;
    name: string;
    email: string;
    role: "vet" | "admin" | "receptionist";
    isActive: boolean;
}

// Entity 2: Pet (List-then-detail relationship with User via ownerId)
export interface Pet {
    id: number;
    name: string;
    species: string;
    breed: string;
    ownerId: number; 
}

// Entity 3: Appointment (Multi-step status lifecycle via enum)
export interface Appointment {
    id: number;
    petId: number;
    vetId: number;
    scheduledAt: Date;
    notes?: string; // optional field
    status: AppointmentStatus;
}

// ===== GENERIC INTERFACE =====
export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// ===== UTILITY TYPES =====
// Partial<T> -- perfect for update payloads
export type UserUpdate = Partial<User>;

// Pick<T, K> -- lightweight preview object
export type PetPreview = Pick<Pet, "id" | "name" | "species">;

// Omit<T, K> -- safe to expose publicly
export type PublicUser = Omit<User, "email" | "isActive">;

// Record<K, T> -- dashboard-style counts
export type RoleCount = Record<"vet" | "admin" | "receptionist", number>;

// ===== ENUMS =====
// Regular enum -- exists at runtime, supports reverse mapping
export enum AppointmentStatus {
    Scheduled,
    Completed,
    Cancelled,
}

// const enum -- inlined at compile time, zero runtime overhead
export const enum Role {
    Vet = "vet",
    Admin = "admin",
    Receptionist = "receptionist",
}