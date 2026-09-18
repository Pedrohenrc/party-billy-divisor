import type { SplitResult } from '../../types/split.ts';
import { formatMoney } from '../../utils/utils.ts';

interface SplitPreviewProps {
    result: SplitResult;
}

export default function SplitPreview({ result }: SplitPreviewProps) {
    if (!result.success) {
        return (
            <div className="alert alert-warning">
                <p>Estes itens ainda não têm ninguém vinculado:</p>

                <ul>
                    {result.missingProducts.map((productName) => (
                        <li key={productName}>{productName}</li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <div className="split-preview">
            <div className="split-list">
                {result.splits.map((split) => (
                    <div className="split-row" key={split.personId}>
                        <div className="split-row-header">
                            <span className="split-name">{split.personName}</span>
                            <span className="split-total">R$ {formatMoney(split.total)}</span>
                        </div>

                        <ul className="split-items">
                            {split.items.length > 0 ? (
                                split.items.map((item) => (
                                    <li key={item.productId}>
                                        {item.productName} · R$ {formatMoney(item.productTotal)} ÷{' '}
                                        {item.participantsCount} = R$ {formatMoney(item.shareValue)}
                                    </li>
                                ))
                            ) : (
                                <li>Nenhum item vinculado</li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="split-grand-total">
                <span>Total da conta</span>
                <strong>R$ {formatMoney(result.totalBill)}</strong>
            </div>
        </div>
    );
}
