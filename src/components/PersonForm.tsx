import Button from './Button'
import {useState} from "react";
import type {Person} from "../types/person.ts";
import {getNextId} from "../utils/utils.ts";
import * as React from "react";

export interface PersonFormProps {
    onPersonCreated: () => void;
}
export default function PersonForm(props: PersonFormProps) {

    const [name, setName] = useState('')

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()

        const person: Person = {
            id: getNextId("person"),
            name
        };

        localStorage.setItem(
            `person${person.id}`,
            JSON.stringify(person)
        );

        setName("");
        props.onPersonCreated();
    }

    return (

        <form className="form" onSubmit={handleSubmit}>
            <h3>Cadastrar Pessoa</h3>
            <input onChange={(e) => setName(e.target.value)}
                   placeholder='Digite o nome'
                   type="text"/>
            <Button text='Cadastrar Pessoa' type={'submit'} />
        </form>

    )

}