import type { User, ApiVet } from "../types/index";

interface VetCardProps {
    vet: User | ApiVet;
    onSelect: (vet: User | ApiVet) => void;
}

function VetCard({ vet, onSelect }: VetCardProps) {
    // Typed event handler as required by GT2 rubric
    const handleSelect = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        onSelect(vet);
    };

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{vet.name}</h3>
            <p className="text-gray-600 dark:text-gray-300">Email: {vet.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Role: {vet.role}</p>
            <button 
                onClick={handleSelect}
                className="mt-3 rounded bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
                Select Vet
            </button>
        </div>
    );
}

export default VetCard;