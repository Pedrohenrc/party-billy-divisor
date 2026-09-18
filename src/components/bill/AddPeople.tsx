import { useState } from 'react';
import { Button } from '../ui/Button.tsx';
import type { Person } from '../../types/person.ts';

interface AddPeopleProps {
    productId: number;
    persons: Person[];
    selectedPersonIds: number[];
    onClose: () => void;
    onConfirm: (productId: number, personIds: number[]) => void;
}

export default function AddPeople(props: AddPeopleProps) {
    const [selected, setSelected] = useState<number[]>(props.selectedPersonIds);

    const allSelected = props.persons.length > 0 && selected.length === props.persons.length;

    function togglePerson(personId: number) {
        setSelected((current) =>
            current.includes(personId)
                ? current.filter((id) => id !== personId)
                : [...current, personId]
        );
    }

    function toggleAll() {
        setSelected((current) =>
            current.length === props.persons.length ? [] : props.persons.map((person) => person.id)
        );
    }

    return (
        <div className="add-people">
            {props.persons.length === 0 ? (
                <p className="add-people-empty">Cadastre pessoas para vinculá-las a este item.</p>
            ) : (
                <>
                    <label className="checkbox checkbox-all">
                        <input type="checkbox" checked={allSelected} onChange={toggleAll} />
                        Selecionar todos
                    </label>

                    <div className="add-people-options">
                        {props.persons.map((person) => (
                            <label className="checkbox" key={person.id}>
                                <input
                                    type="checkbox"
                                    checked={selected.includes(person.id)}
                                    onChange={() => togglePerson(person.id)}
                                />
                                {person.name}
                            </label>
                        ))}
                    </div>
                </>
            )}

            <div className="add-people-actions">
                <Button
                    size="sm"
                    onClick={() => {
                        props.onConfirm(props.productId, selected);
                        props.onClose();
                    }}
                >
                    Salvar
                </Button>

                <Button size="sm" variant="secondary" onClick={props.onClose}>
                    Cancelar
                </Button>
            </div>
        </div>
    );
}
