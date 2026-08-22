import type { Pet, ApiPet } from "../types/index";

interface PetCardProps {
    pet: Pet | ApiPet;
    variant?: "default" | "compact";
}

function PetCard({ pet, variant = "default" }: PetCardProps) {
    const isCompact = variant === "compact";

    return (
        <div className={`rounded-lg border border-gray-200 bg-white shadow-sm dark:bg-gray-800 dark:border-gray-700 ${isCompact ? "p-3" : "p-5"}`}>
            <h3 className={`font-bold text-gray-900 dark:text-white ${isCompact ? "text-sm" : "text-lg"}`}>
                {pet.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Species: {pet.species}</p>
            {!isCompact && (
                <>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Breed: {pet.breed}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Owner ID: {pet.ownerId}</p>
                </>
            )}
        </div>
    );
}

export default PetCard;