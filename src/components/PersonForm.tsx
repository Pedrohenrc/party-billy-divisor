import Button from './Button'
import {useState} from "react";
import type {Person} from "../types/person.ts";
import {getNextId} from "../utils/utils.ts";

export default function PersonForm() {

    const [name, setName] = useState('')

    const person: Person = {
        id: getNextId("person"),
        name
    };

    return (

        <form onSubmit={() => localStorage.setItem(`person${person.id}`, JSON.stringify(person))}>
            <h1>Cadastrar Pessoa</h1>
            <input onChange={(e) => setName(e.target.value)}
                   placeholder='Digite o nome'
                   type="text"/>
            <Button text='Cadastrar Pessoa' />
        </form>

    )

}