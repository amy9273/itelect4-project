import type { User } from "../types/index";

interface VetCardProps {
    vet: User;
    onSelect: (vet: User) => void;
}

function VetCard({ vet, onSelect }: VetCardProps) {
    // Typed event handler as required by GT2 rubric
    const handleSelect = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        onSelect(vet);
    };

    return (
        <div>
            <h3>{vet.name}</h3>
            <p>Email: {vet.email}</p>
            <p>Role: {vet.role}</p>
            <button onClick={handleSelect}>
                Select Vet
            </button>
        </div>
    );
}

export default VetCard;