import Button from "./Button.tsx";
import {useState} from "react";
import type {Product} from "../types/product.ts";
import {getNextId} from "../utils/utils.ts";
import * as React from "react";

export interface ProductFormProps {
    onProductCreated: () => void;

}
export default function ProductForm(props: ProductFormProps) {

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();

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
        setPrice(0);
        props.onProductCreated();

    }

    return (

        <form className="form" onSubmit={handleSubmit}>
            <h3>Cadastrar Item</h3>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder='Digite o nome do produto' type="text"/>
            <input value={price === 0 ? "" : price} onChange={(e) => setPrice(Number(e.target.value))} placeholder='Digite o valor do produto' type="number"/>
            <Button text='Cadastrar produto' type={'submit'} />
        </form>

    );

}