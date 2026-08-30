import React from "react";
import type { Appointment, ApiAppointment } from "../types/index";
import { AppointmentStatus } from "../types/index";
import SubmissionBadge from "./SubmissionBadge";

interface AppointmentCardProps {
    appointment: Appointment | ApiAppointment;
    displayIndex?: number;
    petName?: string;
    vetName?: string;
    isDoctorView?: boolean;
    onUpdateStatus?: (status: string) => void;
    children?: React.ReactNode; // Allows wrapping content
}

// Using React.FC style as shown in the Session 3 PDF
const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
    appointment, 
    displayIndex, 
    petName, 
    vetName, 
    isDoctorView, 
    onUpdateStatus, 
    children 
}) => {
    // Helper to get variant based on appointment status
    const getStatusVariant = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.Completed:
                return "success";
            case AppointmentStatus.Cancelled:
                return "error";
            case AppointmentStatus.Scheduled:
            default:
                return "info";
        }
    };

    // Use displayIndex if provided, or parse numeric ID, or show appointment.id
    const displayNumber = displayIndex ?? appointment.id;

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between space-y-4">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Appointment #{displayNumber}
                        </h3>
                        {appointment.type && (
                            <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300">
                                {appointment.type}
                            </span>
                        )}
                    </div>
                    <SubmissionBadge 
                        status={appointment.status} 
                        variant={getStatusVariant(appointment.status)} 
                    />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                    Pet: <span className="font-semibold text-gray-800 dark:text-gray-100">{petName || `Pet #${appointment.petId}`}</span> | Vet: <span className="font-semibold text-gray-800 dark:text-gray-100">{vetName || `Dr. (ID #${appointment.vetId})`}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Scheduled: <span className="font-medium text-gray-800 dark:text-gray-100">{new Date(appointment.scheduledAt).toLocaleDateString()}</span>
                </p>
                {appointment.notes && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded italic">
                        Notes: {appointment.notes}
                    </p>
                )}
            </div>

            {/* Doctor Status Action Buttons */}
            {isDoctorView && onUpdateStatus && (
                <div className="pt-3 border-t border-gray-100 dark:border-gray-700/60 flex flex-wrap gap-2 items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Doctor Actions:</span>
                    <div className="flex gap-2">
                        {appointment.status !== AppointmentStatus.Completed && (
                            <button
                                type="button"
                                onClick={() => onUpdateStatus(AppointmentStatus.Completed)}
                                className="px-2.5 py-1 text-xs font-semibold rounded bg-green-600 hover:bg-green-700 text-white transition-colors cursor-pointer"
                            >
                                Mark Completed
                            </button>
                        )}
                        {appointment.status !== AppointmentStatus.Cancelled && (
                            <button
                                type="button"
                                onClick={() => onUpdateStatus(AppointmentStatus.Cancelled)}
                                className="px-2.5 py-1 text-xs font-semibold rounded bg-red-600 hover:bg-red-700 text-white transition-colors cursor-pointer"
                            >
                                Mark Cancelled
                            </button>
                        )}
                        {appointment.status !== AppointmentStatus.Scheduled && (
                            <button
                                type="button"
                                onClick={() => onUpdateStatus(AppointmentStatus.Scheduled)}
                                className="px-2.5 py-1 text-xs font-semibold rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 transition-colors cursor-pointer"
                            >
                                Set Scheduled
                            </button>
                        )}
                    </div>
                </div>
            )}
            
            {/* Renders any children passed inside the component tags */}
            {children && (
                <div className="pt-2 border-t border-gray-100 dark:border-gray-700 text-xs text-blue-600 dark:text-blue-400">
                    {children}
                </div>
            )}
        </div>
    );
};

export default AppointmentCard;