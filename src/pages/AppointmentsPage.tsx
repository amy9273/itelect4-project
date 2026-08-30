import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiAppointment } from "../types/index";
import { AppointmentStatus } from "../types/index";
import { appointmentSchema, type AppointmentFormValues } from "../schemas/appointmentSchema";
import AppointmentCard from "../components/AppointmentCard";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/uiStore";
import { fetchAppointments, createAppointment } from "../api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AppointmentsPage() {
    const searchTerm = useUiStore((state) => state.searchTerm);
    const setSearchTerm = useUiStore((state) => state.setSearchTerm);
    const previousSearch = usePrevious(searchTerm);

    const queryClient = useQueryClient();

    // React Hook Form with Zod validation resolver
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AppointmentFormValues>({
        resolver: zodResolver(appointmentSchema),
        mode: "onBlur",
        defaultValues: {
            petId: 101,
            vetId: 1,
            notes: "",
            status: AppointmentStatus.Scheduled,
        },
    });

    // 1. READ -- useQuery hook fetching real appointments from json-server
    const { data: appointments, isPending, isError, error } = useQuery<ApiAppointment[]>({
        queryKey: ["appointments"],
        queryFn: fetchAppointments,
    });

    // 2. WRITE -- useMutation hook that POSTs to json-server and invalidates query on success
    const addAppointmentMutation = useMutation({
        mutationFn: createAppointment,
        onSuccess: () => {
            // Invalidate the cache to trigger a background refetch
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            reset();
        },
    });

    // Form submission handler executed only after validation passes
    const onSubmit = (values: AppointmentFormValues): void => {
        addAppointmentMutation.mutate({
            petId: values.petId,
            vetId: values.vetId,
            scheduledAt: new Date().toISOString(),
            notes: values.notes.trim() || undefined,
            status: values.status,
        });
    };

    if (isPending) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-pulse text-muted-foreground font-semibold text-lg">
                    Loading appointments...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="max-w-md mx-auto rounded-lg bg-destructive/10 p-6 border border-destructive/30 text-destructive text-center shadow-md">
                <p className="font-bold text-lg mb-2">Error Loading Appointments</p>
                <p className="text-sm mb-4">{error.message} -- is json-server running on port 3001?</p>
            </div>
        );
    }

    const filteredAppointments = appointments.filter((apt) => {
        const notesText = apt.notes?.toLowerCase() || "";
        const statusText = apt.status.toLowerCase();
        return (
            notesText.includes(searchTerm.toLowerCase()) ||
            statusText.includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-extrabold text-foreground">
                    Scheduled Appointments
                </h2>
            </div>

            {/* Appointment Booking Form with React Hook Form + Zod + Shadcn */}
            <div className="p-5 border border-border bg-card rounded-xl shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-foreground">
                    Book New Appointment
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="petId">Pet ID</Label>
                        <Input
                            id="petId"
                            type="number"
                            {...register("petId", { valueAsNumber: true })}
                            aria-invalid={errors.petId ? true : undefined}
                            placeholder="e.g. 101"
                        />
                        {errors.petId && (
                            <p className="text-xs text-destructive font-medium">
                                {errors.petId.message}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="vetId">Vet ID</Label>
                        <Input
                            id="vetId"
                            type="number"
                            {...register("vetId", { valueAsNumber: true })}
                            aria-invalid={errors.vetId ? true : undefined}
                            placeholder="e.g. 1"
                        />
                        {errors.vetId && (
                            <p className="text-xs text-destructive font-medium">
                                {errors.vetId.message}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            {...register("status")}
                            aria-invalid={errors.status ? true : undefined}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            <option value={AppointmentStatus.Scheduled} className="bg-background text-foreground">
                                Scheduled
                            </option>
                            <option value={AppointmentStatus.Completed} className="bg-background text-foreground">
                                Completed
                            </option>
                            <option value={AppointmentStatus.Cancelled} className="bg-background text-foreground">
                                Cancelled
                            </option>
                        </select>
                        {errors.status && (
                            <p className="text-xs text-destructive font-medium">
                                {errors.status.message}
                            </p>
                        )}
                    </div>

                    <div className="grid gap-1.5">
                        <Label htmlFor="notes">Appointment Notes</Label>
                        <Input
                            id="notes"
                            type="text"
                            {...register("notes")}
                            aria-invalid={errors.notes ? true : undefined}
                            placeholder="e.g. Annual checkup..."
                        />
                        {errors.notes && (
                            <p className="text-xs text-destructive font-medium">
                                {errors.notes.message}
                            </p>
                        )}
                    </div>

                    <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={addAppointmentMutation.isPending}
                        >
                            {addAppointmentMutation.isPending ? "Scheduling..." : "Schedule Appointment"}
                        </Button>
                    </div>
                </form>

                {addAppointmentMutation.isError && (
                    <p className="text-sm text-destructive">
                        {addAppointmentMutation.error.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search appointments by notes or status (Scheduled, Completed, Cancelled)..."
                    className="w-full bg-card"
                />
                
                {previousSearch !== undefined && previousSearch !== searchTerm && (
                    <p className="text-muted-foreground text-xs italic">
                        Previous search: "{previousSearch}"
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAppointments.length === 0 ? (
                    <div className="col-span-2 p-8 border border-border bg-card rounded-lg text-center text-muted-foreground">
                        No appointments found.
                    </div>
                ) : (
                    filteredAppointments.map((apt) => (
                        <AppointmentCard key={apt.id} appointment={apt}>
                            <p className="font-semibold">Reminder: Please arrive 15 minutes before slot.</p>
                        </AppointmentCard>
                    ))
                )}
            </div>
        </div>
    );
}

export default AppointmentsPage;
