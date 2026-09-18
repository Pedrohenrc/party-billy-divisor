import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Button } from '../ui/Button.tsx';
import { Input } from '../ui/Input.tsx';
import { parseMoneyInput } from '../../utils/utils.ts';

interface ProductFormProps {
    onAddProduct: (name: string, unitPrice: number, quantity: number) => void;
}

export default function ProductForm({ onAddProduct }: ProductFormProps) {
    const [name, setName] = useState('');
    const [priceInput, setPriceInput] = useState('');
    const [quantityInput, setQuantityInput] = useState('1');
    const [error, setError] = useState<string | null>(null);

    function handlePriceChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;

        if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
            setPriceInput(value);
        }
    }

    function handleQuantityChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;

        if (/^[0-9]*$/.test(value)) {
            setQuantityInput(value);
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const unitPrice = parseMoneyInput(priceInput);
        const quantity = Number(quantityInput || '1');

        if (!name.trim()) {
            setError('Informe o nome do item');
            return;
        }

        if (unitPrice <= 0) {
            setError('Informe um valor maior que zero');
            return;
        }

        if (quantity <= 0) {
            setError('A quantidade precisa ser no mínimo 1');
            return;
        }

        setError(null);
        onAddProduct(name, unitPrice, quantity);
        setName('');
        setPriceInput('');
        setQuantityInput('1');
    }

    return (
        <form className="stacked-form" onSubmit={handleSubmit}>
            <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex: Pizza calabresa"
                label="Item"
                autoComplete="off"
            />

            <div className="form-row">
                <Input
                    value={priceInput}
                    onChange={handlePriceChange}
                    placeholder="0,00"
                    label="Valor unitário (R$)"
                    inputMode="decimal"
                />

                <Input
                    value={quantityInput}
                    onChange={handleQuantityChange}
                    placeholder="1"
                    label="Qtd."
                    inputMode="numeric"
                />
            </div>

            {error && <p className="field-error">{error}</p>}

            <Button type="submit">Adicionar item</Button>
        </form>
    );
}
