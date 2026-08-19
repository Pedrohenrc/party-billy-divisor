import { useState } from "react";
import type { Person } from "../types/person.ts";
import type { PersonProduct } from "../types/personProduct.ts";
import Button from "./Button.tsx";

interface AddPeopleProps {
    productId: number;
    persons: Person[];
    personProducts: PersonProduct[];
    onClose: () => void;
    onRelationsChanged: () => void;
}

export default function AddPeople(props: AddPeopleProps) {

    const initialSelected = props.personProducts
        .filter(relation => relation.productId === props.productId)
        .map(relation => relation.personId);

    const [selectedPeople, setSelectedPeople] = useState<number[]>(initialSelected);

    function togglePerson(personId: number) {
        setSelectedPeople((current) => {
            if (current.includes(personId)) {
                return current.filter(id => id !== personId);
            }

            return [...current, personId];
        });
    }

    function handleAddPeople() {
        const allRelations: PersonProduct[] = JSON.parse(
            localStorage.getItem("personProducts") || "[]"
        );

        const otherRelations = allRelations.filter(
            relation => relation.productId !== props.productId
        );

        const newRelations: PersonProduct[] = selectedPeople.map(personId => ({
            personId,
            productId: props.productId,
        }));

        localStorage.setItem(
            "personProducts",
            JSON.stringify([...otherRelations, ...newRelations])
        );

        props.onRelationsChanged()
        props.onClose();
    }

    return (
        <div className="panel add-people">
            <h2>Adicionar pessoas</h2>

            <div className="add-people-options">
                {props.persons.map((person) => (
                    <label key={person.id}>
                        <input
                            type="checkbox"
                            checked={selectedPeople.includes(person.id)}
                            onChange={() => togglePerson(person.id)}
                        />

                        {person.name}
                    </label>
                ))}
            </div>

            <div className="add-people-actions">
                <Button
                    text="Adicionar"
                    type={'button'}
                    onClick={handleAddPeople}
                />

                <Button
                    text="Cancelar"
                    type={'button'}
                    variant={'secondary'}
                    onClick={props.onClose}
                />
            </div>
        </div>
    );
}