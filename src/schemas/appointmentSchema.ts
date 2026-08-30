import { z } from "zod";
import { AppointmentStatus } from "../types/index";

export const appointmentSchema = z.object({
    petId: z
        .number({ message: "Pet ID must be a valid number." })
        .int("Pet ID must be an integer.")
        .positive("Pet ID must be greater than 0."),
    vetId: z
        .number({ message: "Vet ID must be a valid number." })
        .int("Vet ID must be an integer.")
        .positive("Vet ID must be greater than 0."),
    notes: z
        .string()
        .min(3, "Appointment notes must be at least 3 characters long.")
        .max(200, "Appointment notes cannot exceed 200 characters.")
        .refine((val) => val.trim().length >= 3, {
            message: "Notes cannot consist of whitespace only.",
        }),
    status: z.enum(
        [
            AppointmentStatus.Scheduled,
            AppointmentStatus.Completed,
            AppointmentStatus.Cancelled,
        ] as const,
        {
            message: "Please select a valid appointment status.",
        }
    ),
});

// Derive the TypeScript type directly from the schema
export type AppointmentFormValues = z.infer<typeof appointmentSchema>;
