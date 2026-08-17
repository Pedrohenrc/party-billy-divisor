import Button from "./Button.tsx";
import {useState} from "react";
import type {Product} from "../types/product.ts";
import {getNextId} from "../utils/utils.ts";


export default function ProductForm() {

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);

    const product: Product = {
        id: getNextId('product'),
        name: name,
        price: price,
    }

    return (

        <form onSubmit={() => localStorage.setItem(`product${product.id}`, JSON.stringify(product))}>
            <h1>Cadastrar Item</h1>
            <input onChange={(e) => setName(e.target.value)} placeholder='Digite o nome do produto' type="text"/>
            <input onChange={(e) => setPrice(Number(e.target.value))} placeholder='Digite o valor do produto' type="number"/>
            <Button text='Cadastrar produto'/>
        </form>

    );

}