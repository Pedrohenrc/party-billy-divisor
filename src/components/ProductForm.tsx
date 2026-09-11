import Button from "./Button.tsx";
import {useState} from "react";
import type {Product} from "../types/product.ts";
import {getNextId, parseMoneyInput} from "../utils/utils.ts";
import * as React from "react";

export interface ProductFormProps {
    onProductCreated: () => void;

}
export default function ProductForm(props: ProductFormProps) {

    const [name, setName] = useState("");
    const [priceInput, setPriceInput] = useState("");

    function handlePriceChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value;

        if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
            setPriceInput(value);
        }
    }

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();

        const price = parseMoneyInput(priceInput);

        if (!name.trim() || price <= 0) {
            return;
        }

        const product: Product = {
            id: getNextId('product'),
            name: name.trim(),
            price: price,
        }

        localStorage.setItem(`product${product.id}`, JSON.stringify(product));

        setName("");
        setPriceInput("");
        props.onProductCreated();

    }

    return (

        <form className="form" onSubmit={handleSubmit}>
            <h3>Cadastrar Item</h3>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Digite o nome do produto' type="text"/>
            <input
                value={priceInput}
                onChange={handlePriceChange}
                placeholder='Digite o valor do produto (ex: 12,50)'
                type="text"
                inputMode="decimal"
            />
            <Button text='Cadastrar produto' type={'submit'} />
        </form>

    );

}