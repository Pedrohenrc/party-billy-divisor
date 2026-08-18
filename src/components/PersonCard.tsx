import Button from "./Button.tsx";
import type {Product} from "../types/product.ts";
import type {PersonProduct} from "../types/personProduct.ts";

interface PersonCardProps {
    id: number;
    name: string;
    products: Product[];
    personProducts: PersonProduct[];
    onRemove: (id: number) => void;
}

export default function PersonCard (props: PersonCardProps) {

    const productIds = props.personProducts
        .filter(relation => relation.personId === props.id)
        .map(relation => relation.productId);

    const relatedProducts = props.products.filter((product) =>
        productIds.includes(product.id)
    );

    return (

        <div>
            <h1>{props.name}</h1>

            <p>
                Produtos:{" "}
                {relatedProducts.length > 0
                    ? relatedProducts.map((product) => product.name).join(", ")
                    : "Nenhum"}
            </p>

            <Button
                text={'Remover'}
                type={'button'}
                onClick={() => props.onRemove(props.id)}
            />
        </div>

    );

}
