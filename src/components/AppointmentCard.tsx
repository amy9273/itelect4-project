import React from "react";
import type { Appointment, ApiAppointment } from "../types/index";
import { AppointmentStatus } from "../types/index";
import SubmissionBadge from "./SubmissionBadge";

interface AppointmentCardProps {
    appointment: Appointment | ApiAppointment;
    children?: React.ReactNode; // Allows wrapping content
}

// Using React.FC style as shown in the Session 3 PDF
const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, children }) => {
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

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        Appointment #{appointment.id}
                    </h3>
                    <SubmissionBadge 
                        status={appointment.status} 
                        variant={getStatusVariant(appointment.status)} 
                    />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    Pet ID: <span className="font-semibold text-gray-800 dark:text-gray-100">{appointment.petId}</span> | Vet ID: <span className="font-semibold text-gray-800 dark:text-gray-100">{appointment.vetId}</span>
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
            
            {/* Renders any children passed inside the component tags */}
            {children && (
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-blue-600 dark:text-blue-400">
                    {children}
                </div>
            )}
        </div>
    );
};

export default AppointmentCard;