import type { Appointment } from "../types/index";
import { AppointmentStatus } from "../types/index";

interface AppointmentCardProps {
    appointment: Appointment;
    children?: React.ReactNode; // Allows wrapping content
}

// Using React.FC style as shown in the Session 3 PDF
const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, children }) => {
    // Helper to get readable status string
    const getStatusText = (status: AppointmentStatus) => {
        return AppointmentStatus[status];
    };

    return (
        <div>
            <h3>Appointment #{appointment.id}</h3>
            <p>Pet ID: {appointment.petId} | Vet ID: {appointment.vetId}</p>
            <p>Scheduled: {appointment.scheduledAt.toLocaleDateString()}</p>
            <p>Status: <strong>{getStatusText(appointment.status)}</strong></p>
            {appointment.notes && <p>Notes: {appointment.notes}</p>}
            
            {/* Renders any children passed inside the component tags */}
            {children && <div>{children}</div>}
        </div>
    );
};

export default AppointmentCard;