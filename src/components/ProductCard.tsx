import Button from "./Button.tsx";
import type {Person} from "../types/person.ts";
import type {PersonProduct} from "../types/personProduct.ts";
interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    persons: Person[];
    personsProducts: PersonProduct[];
    onAddPeople (productId: number): void;
    onRemove (productId: number): void;
}

export default function ProductCard(props: ProductCardProps) {

    const participantsIds = props.personsProducts
        .filter((relation) => relation.productId == props.id)
        .map((relation) => relation.personId);

    const participants = props.persons.filter((person) =>
        participantsIds.includes(person.id)
    );

    return (
        <div>
            <h1>{props.name}</h1>
            <p>Valor: {props.price}R$</p>

            <p>
                Participantes:{" "}
                {participants.length > 0
                    ? participants.map((person) => person.name).join(", ")
                    : "Nenhum"}
            </p>

            <Button
                text={'Adicionar pessoas'}
                type={'button'}
                onClick={() => props.onAddPeople(props.id)}
            />

            <Button
                text={'Remover'}
                type={'button'}
                onClick={() => props.onRemove(props.id)}
            />

        </div>
    )

}