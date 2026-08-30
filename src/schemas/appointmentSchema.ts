import { z } from "zod";
import { AppointmentStatus } from "../types/index";

export const APPOINTMENT_TYPES = [
    "Routine Checkup",
    "Vaccination & Shots",
    "Surgery Consultation",
    "Dental Cleaning",
    "Emergency Care",
    "Grooming & Hygiene",
    "Other Services",
] as const;

export const appointmentSchema = z.object({
    petId: z
        .number({ message: "Pet ID must be a valid number." })
        .int("Pet ID must be an integer.")
        .positive("Pet ID must be greater than 0."),
    vetId: z
        .number({ message: "Vet ID must be a valid number." })
        .int("Vet ID must be an integer.")
        .positive("Vet ID must be greater than 0."),
    type: z
        .string({ message: "Please select an appointment type." })
        .min(1, "Appointment type is required."),
    notes: z
        .string()
        .max(200, "Appointment notes cannot exceed 200 characters.")
        .optional()
        .or(z.literal("")),
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
