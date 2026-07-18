import type { Pet } from "../types/index";

interface PetCardProps {
    pet: Pet;
}

function PetCard({ pet }: PetCardProps) {
    return (
        <div className="pet-card" style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
            <h3>{pet.name}</h3>
            <p>Species: {pet.species}</p>
            <p>Breed: {pet.breed}</p>
            <p>Owner ID: {pet.ownerId}</p>
        </div>
    );
}

export default PetCard;