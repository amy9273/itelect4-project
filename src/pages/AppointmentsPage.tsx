import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiAppointment, ApiVet, ApiPet } from "../types/index";
import { AppointmentStatus } from "../types/index";
import { appointmentSchema, APPOINTMENT_TYPES, type AppointmentFormValues } from "../schemas/appointmentSchema";
import AppointmentCard from "../components/AppointmentCard";
import usePrevious from "../hooks/usePrevious";
import useUiStore from "../store/uiStore";
import useAuthStore from "../store/authStore";
import { fetchAppointments, fetchVets, fetchPets, createAppointment, createPet, updateAppointmentStatus } from "../api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AppointmentsPage() {
    const searchTerm = useUiStore((state) => state.searchTerm);
    const setSearchTerm = useUiStore((state) => state.setSearchTerm);
    const previousSearch = usePrevious(searchTerm);
    const userId = useAuthStore((state) => state.userId);
    const userName = useAuthStore((state) => state.userName);
    const userRole = useAuthStore((state) => state.userRole);
    const vetId = useAuthStore((state) => state.vetId);

    const isDoctor = userRole === "vet";

    // Modal state for selecting / adding a pet during schedule flow
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"select" | "add">("select");
    const [selectedModalPetId, setSelectedModalPetId] = useState<string>("");
    const [pendingFormValues, setPendingFormValues] = useState<AppointmentFormValues | null>(null);

    // Add pet form fields
    const [modalPetName, setModalPetName] = useState("");
    const [modalPetSpecies, setModalPetSpecies] = useState("Dog");
    const [modalPetBreed, setModalPetBreed] = useState("");

    const queryClient = useQueryClient();

    // Fetch vets and pets
    const { data: vets } = useQuery<ApiVet[]>({
        queryKey: ["vets"],
        queryFn: fetchVets,
    });

    const { data: pets } = useQuery<ApiPet[]>({
        queryKey: ["pets"],
        queryFn: fetchPets,
    });

    // Filter pets that belong to the logged-in owner
    const myPets = pets?.filter((pet) => userId ? Number(pet.ownerId) === Number(userId) : true) || [];

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
            petId: 101, // placeholder for zod validation, overwritten by modal selection
            vetId: 1,
            type: APPOINTMENT_TYPES[0],
            notes: "",
            status: AppointmentStatus.Scheduled,
        },
    });

    // 1. READ -- useQuery hook fetching real appointments from json-server
    const { data: appointments, isPending, isError, error } = useQuery<ApiAppointment[]>({
        queryKey: ["appointments"],
        queryFn: fetchAppointments,
    });

    // Appointment booking mutation
    const addAppointmentMutation = useMutation({
        mutationFn: createAppointment,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
            setIsPetModalOpen(false);
            setPendingFormValues(null);
            reset({
                petId: 101,
                vetId: 1,
                type: APPOINTMENT_TYPES[0],
                notes: "",
                status: AppointmentStatus.Scheduled,
            });
        },
    });

    // Status update mutation (for Doctors)
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            updateAppointmentStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["appointments"] });
        },
    });

    // Pet registration mutation
    const addPetMutation = useMutation({
        mutationFn: createPet,
        onSuccess: (newPet) => {
            queryClient.invalidateQueries({ queryKey: ["pets"] });
            // If we have pending appointment details, immediately book appointment for this newly created pet!
            if (pendingFormValues) {
                addAppointmentMutation.mutate({
                    petId: Number(newPet.id),
                    vetId: Number(pendingFormValues.vetId),
                    type: pendingFormValues.type,
                    scheduledAt: new Date().toISOString(),
                    notes: pendingFormValues.notes?.trim() || undefined,
                    status: AppointmentStatus.Scheduled, // Owners always schedule as 'Scheduled'
                });
            }
            setModalPetName("");
            setModalPetBreed("");
            setModalPetSpecies("Dog");
        },
    });

    // When user clicks "Schedule Appointment" button in the form:
    const onFormSubmit = (values: AppointmentFormValues): void => {
        setPendingFormValues({
            ...values,
            status: AppointmentStatus.Scheduled, // Owners always submit as Scheduled
        });
        if (myPets.length > 0) {
            setSelectedModalPetId(String(myPets[0].id));
            setModalMode("select");
        } else {
            setSelectedModalPetId("NEW_PET");
            setModalMode("add");
        }
        setIsPetModalOpen(true);
    };

    // When user selects an existing pet from the modal:
    const handleSelectPetAndBook = (petId: number) => {
        if (!pendingFormValues || !petId) return;
        addAppointmentMutation.mutate({
            petId: petId,
            vetId: Number(pendingFormValues.vetId),
            type: pendingFormValues.type,
            scheduledAt: new Date().toISOString(),
            notes: pendingFormValues.notes?.trim() || undefined,
            status: AppointmentStatus.Scheduled, // Owners always schedule as 'Scheduled'
        });
    };

    // When user submits the new pet form from the modal:
    const handleModalSubmitPet = (e: React.FormEvent) => {
        e.preventDefault();
        if (!modalPetName.trim() || !modalPetBreed.trim()) return;

        addPetMutation.mutate({
            name: modalPetName.trim(),
            species: modalPetSpecies,
            breed: modalPetBreed.trim(),
            ownerId: userId || 5,
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

    // Filter appointments for the user's pets or match search
    const myPetIds = new Set(myPets.map((p) => String(p.id)));

    const filteredAppointments = appointments.filter((apt) => {
        // If doctor: show appointments assigned to this doctor (or all if not filtered)
        // If owner: show appointments for the owner's pets
        const matchesRole = isDoctor
            ? (vetId ? Number(apt.vetId) === Number(vetId) : true)
            : (myPets.length > 0 ? myPetIds.has(String(apt.petId)) : true);

        const notesText = apt.notes?.toLowerCase() || "";
        const typeText = apt.type?.toLowerCase() || "";
        const statusText = apt.status.toLowerCase();
        const matchesSearch =
            notesText.includes(searchTerm.toLowerCase()) ||
            typeText.includes(searchTerm.toLowerCase()) ||
            statusText.includes(searchTerm.toLowerCase());

        return matchesRole && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-extrabold text-foreground flex items-center gap-2">
                        {isDoctor ? (
                            <span>{userName ? `${userName}'s Patient Schedule` : "Doctor Appointment Schedule"}</span>
                        ) : (
                            <span>{userName ? `${userName}'s Appointments` : "Scheduled Appointments"}</span>
                        )}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        {isDoctor
                            ? "View patient appointments assigned to you and update medical status (Completed / Cancelled)."
                            : "Book checkups or vaccinations for your registered pets and track upcoming slots."}
                    </p>
                </div>
            </div>

            {/* ONLY PET OWNERS SEE THE BOOKING FORM */}
            {!isDoctor && (
                <div className="p-5 border border-border bg-card rounded-xl shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-foreground">
                        Book New Appointment
                    </h3>

                    <form onSubmit={handleSubmit(onFormSubmit)} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="vetId">Select Veterinarian</Label>
                            <select
                                id="vetId"
                                {...register("vetId", { valueAsNumber: true })}
                                aria-invalid={errors.vetId ? true : undefined}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {vets?.map((vet) => (
                                    <option key={vet.id} value={vet.id} className="bg-background text-foreground">
                                        {vet.name}
                                    </option>
                                )) || (
                                    <>
                                        <option value="1">Dr. Juan dela Cruz</option>
                                        <option value="2">Dr. Maria Santos</option>
                                    </>
                                )}
                            </select>
                            {errors.vetId && (
                                <p className="text-xs text-destructive font-medium">
                                    {errors.vetId.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="type">Appointment Type</Label>
                            <select
                                id="type"
                                {...register("type")}
                                aria-invalid={errors.type ? true : undefined}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            >
                                {APPOINTMENT_TYPES.map((aptType) => (
                                    <option key={aptType} value={aptType} className="bg-background text-foreground">
                                        {aptType}
                                    </option>
                                ))}
                            </select>
                            {errors.type && (
                                <p className="text-xs text-destructive font-medium">
                                    {errors.type.message}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="notes">
                                Notes <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
                            </Label>
                            <Input
                                id="notes"
                                type="text"
                                {...register("notes")}
                                aria-invalid={errors.notes ? true : undefined}
                                placeholder="e.g. Any symptoms or special requests..."
                            />
                            {errors.notes && (
                                <p className="text-xs text-destructive font-medium">
                                    {errors.notes.message}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-3 flex justify-end">
                            <Button
                                type="submit"
                                disabled={addAppointmentMutation.isPending || addPetMutation.isPending}
                            >
                                Schedule Appointment
                            </Button>
                        </div>
                    </form>

                    {addAppointmentMutation.isError && (
                        <p className="text-sm text-destructive">
                            {addAppointmentMutation.error.message}
                        </p>
                    )}
                </div>
            )}

            {/* DOCTOR SUMMARY CARD */}
            {isDoctor && (
                <div className="p-5 border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 rounded-xl flex flex-wrap justify-between items-center gap-4">
                    <div>
                        <h3 className="font-bold text-foreground text-base">
                            Doctor Portal Controls Active
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            You have authority to mark appointments as <strong>Completed</strong> after consultation or <strong>Cancelled</strong>.
                        </p>
                    </div>
                    <div className="flex gap-4 text-xs">
                        <span className="px-3 py-1.5 rounded-lg bg-card border border-border font-semibold">
                            Total Assigned: <strong>{filteredAppointments.length}</strong>
                        </span>
                        <span className="px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-semibold">
                            Completed: <strong>{filteredAppointments.filter(a => a.status === AppointmentStatus.Completed).length}</strong>
                        </span>
                    </div>
                </div>
            )}

            {/* POPUP MODAL TRIGGERED BY SCHEDULE APPOINTMENT: SELECT PET OR ADD NEW PET */}
            {isPetModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
                    <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 space-y-4">
                        <div className="flex justify-between items-center border-b border-border pb-3">
                            <div>
                                <h3 className="text-lg font-bold text-foreground">
                                    {modalMode === "select" ? "Select Pet for Appointment" : "Register a New Pet"}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Account: <span className="font-semibold text-foreground">{userName || "Pet Owner"}</span>
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPetModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground text-sm font-bold px-2 rounded"
                            >
                                Close
                            </button>
                        </div>

                        {/* MODE 1: SELECT PET VIA SIMPLE DROPDOWN */}
                        {modalMode === "select" && (
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                if (selectedModalPetId === "NEW_PET") {
                                    setModalMode("add");
                                } else if (selectedModalPetId) {
                                    handleSelectPetAndBook(Number(selectedModalPetId));
                                }
                            }} className="space-y-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="modalPetSelect">Choose Pet</Label>
                                    <select
                                        id="modalPetSelect"
                                        value={selectedModalPetId}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSelectedModalPetId(val);
                                            if (val === "NEW_PET") {
                                                setModalMode("add");
                                            }
                                        }}
                                        className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm shadow-sm text-foreground focus-visible:outline-none"
                                    >
                                        {myPets.length > 0 ? (
                                            <>
                                                {myPets.map((pet) => (
                                                    <option key={pet.id} value={String(pet.id)} className="bg-background text-foreground">
                                                        {pet.name} ({pet.species} - {pet.breed})
                                                    </option>
                                                ))}
                                                <option value="NEW_PET" className="bg-background text-primary font-semibold">
                                                    + Register a New Pet...
                                                </option>
                                            </>
                                        ) : (
                                            <option value="NEW_PET" className="bg-background text-foreground">
                                                No pet found (Register new pet)
                                            </option>
                                        )}
                                    </select>
                                </div>

                                <div className="pt-3 border-t border-border flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsPetModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={addAppointmentMutation.isPending || !selectedModalPetId}
                                    >
                                        {addAppointmentMutation.isPending ? "Booking..." : "Confirm & Book"}
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* MODE 2: ADD NEW PET */}
                        {modalMode === "add" && (
                            <form onSubmit={handleModalSubmitPet} className="space-y-4">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="modalPetName">Pet Name</Label>
                                    <Input
                                        id="modalPetName"
                                        placeholder="e.g. Bella, Milo, Coco"
                                        value={modalPetName}
                                        onChange={(e) => setModalPetName(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="modalPetSpecies">Species</Label>
                                    <select
                                        id="modalPetSpecies"
                                        value={modalPetSpecies}
                                        onChange={(e) => setModalPetSpecies(e.target.value)}
                                        className="flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm text-foreground focus-visible:outline-none"
                                    >
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Bird">Bird</option>
                                        <option value="Rabbit">Rabbit</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="modalPetBreed">Breed</Label>
                                    <Input
                                        id="modalPetBreed"
                                        placeholder="e.g. Golden Retriever, Persian..."
                                        value={modalPetBreed}
                                        onChange={(e) => setModalPetBreed(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex justify-between items-center pt-3 border-t border-border">
                                    {myPets.length > 0 ? (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setModalMode("select")}
                                        >
                                            &larr; Back to Pet List
                                        </Button>
                                    ) : <div />}
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsPetModalOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={addPetMutation.isPending || !modalPetName.trim() || !modalPetBreed.trim()}
                                        >
                                            {addPetMutation.isPending ? "Saving..." : "Save & Book Appointment"}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search appointments by notes, type, or status (Scheduled, Completed, Cancelled)..."
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
                        {isDoctor ? "No patient appointments found for your schedule." : "No appointments found for your pets."}
                    </div>
                ) : (
                    filteredAppointments.map((apt, index) => {
                        const pet = pets?.find((p) => String(p.id) === String(apt.petId));
                        const vet = vets?.find((v) => String(v.id) === String(apt.vetId));
                        const numericId = parseInt(String(apt.id), 10);
                        const displayIndex = !isNaN(numericId) ? numericId : index + 1;
                        return (
                            <AppointmentCard
                                key={apt.id}
                                appointment={apt}
                                displayIndex={displayIndex}
                                petName={pet ? `${pet.name} (${pet.species})` : undefined}
                                vetName={vet?.name}
                                isDoctorView={isDoctor}
                                onUpdateStatus={isDoctor ? (newStatus) => updateStatusMutation.mutate({ id: apt.id, status: newStatus }) : undefined}
                            >
                                <p className="font-semibold">
                                    {isDoctor ? "Clinical note: Please review pet history prior to treatment." : "Reminder: Please arrive 15 minutes before slot."}
                                </p>
                            </AppointmentCard>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default AppointmentsPage;
