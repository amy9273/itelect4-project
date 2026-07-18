// ===== IMPORTS =====
import type {
    User,
    Pet,
    Appointment,
    StringOrNumber,
    ApiResponse,
    UserUpdate,
    PetPreview,
    PublicUser,
    RoleCount,
} from "../types/index";

import {
    AppointmentStatus,
    Role,
} from "../types/index";

// ===== PRIMITIVE & SPECIAL TYPES =====
const projectName: string = "vet-appointment-system";
const currentYear: number = 2026;
const isFullStack: boolean = true;
const nothing: null = null;
const noSet: undefined = undefined;

function greet(name: string, year: number): string {
    return `Welcome to ${name} -- AY ${year}!`;
}

function logMessage(message: string): void {
    console.log(message);
}
logMessage(greet(projectName, currentYear));

let anything: any = "hello";
anything = 42;
anything = true;

let userInput: unknown = "test";
if (typeof userInput === "string") {
    console.log(userInput.toUpperCase());
}

function throwError(message: string): never {
    throw new Error(message);
}

// ===== USING INTERFACES =====
const vetUser: User = {
    id: 1,
    name: "Dr. Juan dela Cruz",
    email: "juan.vet@example.com",
    role: "vet",
    isActive: true,
};

const pet: Pet = {
    id: 101,
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    ownerId: 5,
};

console.log(vetUser);
console.log(pet);

// ===== TYPE NARROWING =====
function processInput(input: StringOrNumber): string {
    if (typeof input === "string") {
        return input.toUpperCase();
    }
    return input.toFixed(2);
}

function formatDate(value: string | Date): string {
    if (value instanceof Date) {
        return value.toLocaleDateString();
    }
    return value;
}

console.log(processInput("hello"));
console.log(processInput(3.14159));
console.log(formatDate(new Date()));

// ===== GENERIC FUNCTIONS =====
function getFirst<T>(items: T[]): T | undefined {
    return items[0];
}

// Constrained generic -- T must have an "id: number" field
function getById<T extends { id: number }>(
    items: T[],
    id: number
): T | undefined {
    return items.find((item) => item.id === id);
}

const firstUser = getFirst<User>([vetUser]);
const foundPet = getById<Pet>([pet], 101);

console.log(firstUser?.name);
console.log(foundPet?.species);

// ===== GENERIC INTERFACE USAGE =====
const userResponse: ApiResponse<User> = {
    success: true,
    data: vetUser,
};

const petResponse: ApiResponse<Pet[]> = {
    success: true,
    data: [pet],
};

console.log(userResponse.data.name);

// ===== USING UTILITY TYPES =====
const patch: UserUpdate = {
    name: "Dr. Juan D. Cruz",
};

const preview: PetPreview = {
    id: 101,
    name: "Buddy",
    species: "Dog",
};

const publicProfile: PublicUser = {
    id: 1,
    name: "Dr. Juan dela Cruz",
    role: "vet",
};

const roleCount: RoleCount = {
    vet: 5,
    admin: 2,
    receptionist: 3,
};

console.log(patch);
console.log(preview);
console.log(publicProfile);
console.log(roleCount);

// ===== ReturnType =====
function createAppointment(petId: number, vetId: number) {
    return {
        id: 1,
        petId,
        vetId,
        scheduledAt: new Date(),
        status: AppointmentStatus.Scheduled,
    };
}

type NewAppointment = ReturnType<typeof createAppointment>;

const gt1Appointment: NewAppointment = createAppointment(101, 1);
console.log(gt1Appointment);

// ===== USING ENUMS =====
let status: AppointmentStatus = AppointmentStatus.Scheduled;
console.log(AppointmentStatus[status]); // "Scheduled" (reverse mapping)

status = AppointmentStatus.Completed;
console.log(status === AppointmentStatus.Completed); // true

const currentRole: Role = Role.Vet;
console.log(currentRole); // "vet"