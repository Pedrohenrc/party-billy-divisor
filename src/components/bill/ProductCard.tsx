import { Button } from '../ui/Button.tsx';
import AddPeople from './AddPeople.tsx';
import type { Person } from '../../types/person.ts';
import type { PersonProduct } from '../../types/personProduct.ts';
import type { Product } from '../../types/product.ts';
import { formatMoney } from '../../utils/utils.ts';

interface ProductCardProps {
    product: Product;
    persons: Person[];
    relations: PersonProduct[];
    isAddingPeople: boolean;
    onToggleAddPeople: (productId: number) => void;
    onCloseAddPeople: () => void;
    onConfirmParticipants: (productId: number, personIds: number[]) => void;
    onRemove: (productId: number) => void;
}

export default function ProductCard(props: ProductCardProps) {
    const participantIds = props.relations
        .filter((relation) => relation.productId === props.product.id)
        .map((relation) => relation.personId);

    const participants = props.persons.filter((person) => participantIds.includes(person.id));

    const total = props.product.unitPrice * props.product.quantity;

    return (
        <div className={participants.length === 0 ? 'card card-warning' : 'card'}>
            <div className="card-header">
                <div>
                    <h3>{props.product.name}</h3>

                    <p className="card-meta">
                        {props.product.quantity} × R$ {formatMoney(props.product.unitPrice)}
                    </p>
                </div>

                <div className="card-header-side">
                    <span className="card-price">R$ {formatMoney(total)}</span>

                    <button
                        className="card-remove"
                        type="button"
                        onClick={() => props.onRemove(props.product.id)}
                        aria-label={`Remover ${props.product.name}`}
                    >
                        &times;
                    </button>
                </div>
            </div>

            <div className="chip-list">
                {participants.length > 0 ? (
                    participants.map((person) => (
                        <span className="chip" key={person.id}>
                            {person.name}
                        </span>
                    ))
                ) : (
                    <span className="chip-empty">Sem participantes</span>
                )}
            </div>

            <div className="card-actions">
                <Button
                    size="sm"
                    variant={props.isAddingPeople ? 'secondary' : 'ghost'}
                    onClick={() => props.onToggleAddPeople(props.product.id)}
                >
                    {props.isAddingPeople ? 'Fechar' : 'Quem dividiu?'}
                </Button>
            </div>

            {props.isAddingPeople && (
                <AddPeople
                    productId={props.product.id}
                    persons={props.persons}
                    selectedPersonIds={participantIds}
                    onClose={props.onCloseAddPeople}
                    onConfirm={props.onConfirmParticipants}
                />
            )}
        </div>
    );
}
