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

    const allSelected = props.persons.length > 0 &&
        selectedPeople.length === props.persons.length;

    function togglePerson(personId: number) {
        setSelectedPeople((current) => {
            if (current.includes(personId)) {
                return current.filter(id => id !== personId);
            }

            return [...current, personId];
        });
    }

    function toggleAll() {
        setSelectedPeople((current) =>
            current.length === props.persons.length
                ? []
                : props.persons.map((person) => person.id)
        );
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
        <div className="add-people">
            <h4>Adicionar pessoas</h4>

            {props.persons.length > 0 && (
                <label className="add-people-select-all">
                    <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                    />

                    Selecionar todos
                </label>
            )}

            <div className="add-people-options">
                {props.persons.length === 0 && (
                    <p className="add-people-empty">
                        Cadastre pessoas para poder vinculá-las ao produto.
                    </p>
                )}

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