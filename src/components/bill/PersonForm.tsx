import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';

interface PersonFormProps {
    onAddPerson: (name: string) => void;
}

export default function PersonForm({ onAddPerson }: PersonFormProps) {
    const [name, setName] = useState('');

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!name.trim()) {
            return;
        }

        onAddPerson(name);
        setName('');
    }

    return (
        <form className="inline-form" onSubmit={handleSubmit}>
            <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nome da pessoa"
                aria-label="Nome da pessoa"
                autoComplete="off"
            />

            <Button type="submit" size="md">
                Adicionar
            </Button>
        </form>
    );
}
