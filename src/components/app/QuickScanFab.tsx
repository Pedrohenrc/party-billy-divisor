import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { billService } from '../../services/bill.service.ts';
import { useToast } from '../../hooks/useToast.ts';
import { emptyDraft, saveDraft } from '../../utils/draft-storage.ts';
import { ReceiptScanIcon } from '../ui/icons.tsx';

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;


export function QuickScanFab() {
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const toast = useToast();

    const [isScanning, setIsScanning] = useState(false);

    if (location.pathname === '/bills/new') {
        return null;
    }

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

            if (scanned.length === 0) {
                toast.error('Não consegui identificar itens nessa nota. Tente outra foto.');
                return;
            }

            saveDraft({
                ...emptyDraft,
                products: scanned.map((item, index) => ({
                    id: index + 1,
                    name: item.name,
                    unitPrice: Number(item.unit_price),
                    quantity: item.quantity,
                })),
            });

            toast.success(`${scanned.length} item(ns) lido(s) da nota. Falta só finalizar!`);
            navigate('/bills/new');
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : 'Não foi possível ler a nota fiscal'
            );
        } finally {
            setIsScanning(false);
        }
    }

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="visually-hidden"
                onChange={handleFileChange}
                aria-hidden="true"
                tabIndex={-1}
            />

            <button
                type="button"
                className={isScanning ? 'quick-scan-fab is-busy' : 'quick-scan-fab'}
                onClick={handleClick}
                disabled={isScanning}
                aria-label="Escanear nota fiscal e começar uma conta nova"
            >
                {isScanning ? (
                    <span className="quick-scan-fab-spinner" aria-hidden="true" />
                ) : (
                    <ReceiptScanIcon size={24} />
                )}
            </button>
        </>
    );
}
