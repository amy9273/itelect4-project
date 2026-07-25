import type { Pet } from "../types/index";

interface PetCardProps {
    pet: Pet;
}

function PetCard({ pet }: PetCardProps) {
    return (
        <div>
            <h3>{pet.name}</h3>
            <p>Species: {pet.species}</p>
            <p>Breed: {pet.breed}</p>
            <p>Owner ID: {pet.ownerId}</p>
        </div>
    );
}

export default PetCard;