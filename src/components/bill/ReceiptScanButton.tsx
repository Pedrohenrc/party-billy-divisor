import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { billService } from '../../services/bill.service.ts';
import { useToast } from '../../hooks/useToast.ts';
import { Button } from '../ui/Button.tsx';
import { Modal } from '../ui/Modal.tsx';
import { ReceiptScanIcon } from '../ui/icons.tsx';
import { formatMoney } from '../../utils/utils.ts';

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

interface ReviewItem {
    id: number;
    name: string;
    quantity: number;
    unitPrice: number;
    selected: boolean;
}

interface ReceiptScanButtonProps {
    onConfirm: (items: { name: string; unitPrice: number; quantity: number }[]) => void;
}

export default function ReceiptScanButton({ onConfirm }: ReceiptScanButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const toast = useToast();

    const [isScanning, setIsScanning] = useState(false);
    const [reviewItems, setReviewItems] = useState<ReviewItem[] | null>(null);

    function handleClick() {
        inputRef.current?.click();
    }

    async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        event.target.value = '';

        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Envie uma imagem (foto ou print da nota fiscal)');
            return;
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            toast.error('Imagem muito grande (máximo 8MB)');
            return;
        }

        setIsScanning(true);

        try {
            const scanned = await billService.scanReceipt(file);

            setReviewItems(
                scanned.map((item, index) => ({
                    id: index,
                    name: item.name,
                    quantity: item.quantity,
                    unitPrice: Number(item.unit_price),
                    selected: true,
                }))
            );
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Não foi possível ler a nota fiscal'
            );
        } finally {
            setIsScanning(false);
        }
    }

    function toggleItem(id: number) {
        setReviewItems((current) =>
            current?.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item)) ??
            null
        );
    }

    function handleConfirm() {
        const selected = (reviewItems ?? []).filter((item) => item.selected);

        if (selected.length === 0) {
            toast.error('Selecione ao menos um item para adicionar');
            return;
        }

        onConfirm(
            selected.map((item) => ({
                name: item.name,
                unitPrice: item.unitPrice,
                quantity: item.quantity,
            }))
        );

        toast.success(`${selected.length} item(ns) adicionado(s) à conta`);
        setReviewItems(null);
    }

    const selectedCount = reviewItems?.filter((item) => item.selected).length ?? 0;

    return (
        <>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="visually-hidden"
                onChange={handleFileChange}
                aria-hidden="true"
                tabIndex={-1}
            />

            <Button type="button" variant="secondary" onClick={handleClick} loading={isScanning}>
                <span className="btn-icon">
                    <ReceiptScanIcon />
                </span>{' '}
                Ler nota fiscal
            </Button>

            <Modal
                open={reviewItems !== null}
                title="Itens identificados"
                onClose={() => setReviewItems(null)}
                footer={
                    <>
                        <Button variant="ghost" size="sm" onClick={() => setReviewItems(null)}>
                            Cancelar
                        </Button>

                        <Button size="sm" onClick={handleConfirm} disabled={selectedCount === 0}>
                            Adicionar {selectedCount > 0 ? `(${selectedCount})` : ''}
                        </Button>
                    </>
                }
            >
                {reviewItems && reviewItems.length > 0 ? (
                    <div className="receipt-review">
                        <p className="receipt-review-hint">
                            Confira os itens lidos da nota. Desmarque o que estiver errado ou
                            fora do escopo da conta.
                        </p>

                        <div className="receipt-review-list">
                            {reviewItems.map((item) => (
                                <label className="receipt-review-item" key={item.id}>
                                    <input
                                        type="checkbox"
                                        checked={item.selected}
                                        onChange={() => toggleItem(item.id)}
                                    />

                                    <span className="receipt-review-name">{item.name}</span>

                                    <span className="receipt-review-meta">
                                        {item.quantity} × R$ {formatMoney(item.unitPrice)}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="receipt-review-hint">Nenhum item identificado nesta imagem.</p>
                )}
            </Modal>
        </>
    );
}
