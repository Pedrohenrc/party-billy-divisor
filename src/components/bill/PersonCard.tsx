import type { Person } from '../../types/person.ts';
import type { PersonProduct } from '../../types/personProduct.ts';
import type { Product } from '../../types/product.ts';

interface PersonCardProps {
    person: Person;
    products: Product[];
    relations: PersonProduct[];
    onRemove: (personId: number) => void;
}

export default function PersonCard({ person, products, relations, onRemove }: PersonCardProps) {
    const productIds = relations
        .filter((relation) => relation.personId === person.id)
        .map((relation) => relation.productId);

    const relatedProducts = products.filter((product) => productIds.includes(product.id));

    return (
        <div className="card">
            <div className="card-header">
                <h3>{person.name}</h3>

                <button
                    className="card-remove"
                    type="button"
                    onClick={() => onRemove(person.id)}
                    aria-label={`Remover ${person.name}`}
                >
                    &times;
                </button>
            </div>

            <div className="chip-list">
                {relatedProducts.length > 0 ? (
                    relatedProducts.map((product) => (
                        <span className="chip" key={product.id}>
                            {product.name}
                        </span>
                    ))
                ) : (
                    <span className="chip-empty">Nenhum item</span>
                )}
            </div>
        </div>
    );
}
