import Button from "./Button.tsx";
import AddPeople from "./AddPeople.tsx";
import type {Person} from "../types/person.ts";
import type {PersonProduct} from "../types/personProduct.ts";
import {formatMoney} from "../utils/utils.ts";

interface ProductCardProps {
    id: number;
    name: string;
    price: number;
    persons: Person[];
    personsProducts: PersonProduct[];
    isAddingPeople: boolean;
    onToggleAddPeople (productId: number): void;
    onCloseAddPeople (): void;
    onRelationsChanged (): void;
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
        <div className="card">
            <div className="card-header">
                <h3>{props.name}</h3>
                <span className="card-price">R$ {formatMoney(props.price)}</span>
            </div>

            <div className="card-participants">
                {participants.length > 0 ? (
                    participants.map((person) => (
                        <span className="chip" key={person.id}>{person.name}</span>
                    ))
                ) : (
                    <span className="card-participants-empty">Nenhum participante</span>
                )}
            </div>

            <div className="card-actions">
                <Button
                    text={props.isAddingPeople ? 'Fechar' : 'Adicionar pessoas'}
                    type={'button'}
                    variant={props.isAddingPeople ? 'secondary' : 'primary'}
                    onClick={() => props.onToggleAddPeople(props.id)}
                />

                <Button
                    text={'Remover'}
                    type={'button'}
                    variant={'secondary'}
                    onClick={() => props.onRemove(props.id)}
                />
            </div>

            {props.isAddingPeople && (
                <AddPeople
                    productId={props.id}
                    persons={props.persons}
                    personProducts={props.personsProducts}
                    onClose={props.onCloseAddPeople}
                    onRelationsChanged={props.onRelationsChanged}
                />
            )}
        </div>
    )

}