import { useState } from "react";
import Button from "./Button.tsx";
import type { Person } from "../types/person.ts";
import type { Product } from "../types/product.ts";
import type { PersonProduct } from "../types/personProduct.ts";
import type { SplitResult } from "../types/split.ts";
import { calculateBillSplit } from "../utils/utils.ts";

interface BillSplitProps {
    persons: Person[];
    products: Product[];
    personProducts: PersonProduct[];
}

export default function BillSplit(props: BillSplitProps) {

    const [result, setResult] = useState<SplitResult | null>(null);

    function handleDivideBill() {
        const splitResult = calculateBillSplit(
            props.persons,
            props.products,
            props.personProducts
        );

        setResult(splitResult);
    }

    return (
        <div className="bill-split">
            <h2>Dividir Conta</h2>

            <Button
                text="Dividir conta"
                type="button"
                onClick={handleDivideBill}
            />

            {result && !result.success && (
                <div className="bill-split-error">
                    <p>
                        Não é possível dividir a conta. Os produtos abaixo
                        não têm nenhuma pessoa vinculada:
                    </p>

                    <ul>
                        {result.missingProducts.map((productName) => (
                            <li key={productName}>{productName}</li>
                        ))}
                    </ul>
                </div>
            )}

            {result && result.success && (
                <div className="bill-split-result">
                    <div className="card-list">
                        {result.splits.map((split) => (
                            <div className="card bill-split-person" key={split.personId}>
                                <h3>{split.personName}</h3>

                                <ul className="bill-split-items">
                                    {split.items.length > 0 ? (
                                        split.items.map((item) => (
                                            <li key={item.productId}>
                                                {item.productName} — {item.productPrice}R$
                                                {" "}÷ {item.participantsCount} pessoa(s)
                                                {" "}= {item.shareValue}R$
                                            </li>
                                        ))
                                    ) : (
                                        <li>Nenhum item</li>
                                    )}
                                </ul>

                                <p className="bill-split-person-total">
                                    Total: {split.total}R$
                                </p>
                            </div>
                        ))}
                    </div>

                    <p className="bill-split-grand-total">
                        Total geral da conta: {result.totalBill}R$
                    </p>
                </div>
            )}
        </div>
    );
}
