import { useState } from 'react';
import { billService } from '../services/bill.service.ts';
import { isRetryableError } from '../utils/http-client.ts';
import { useToast } from './useToast.ts';
import type { ScannedProduct } from '../types/bill.ts';

const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

const RETRY_TOAST_DURATION = 8000;

export function useReceiptScan(onScanned: (items: ScannedProduct[]) => void) {
    const toast = useToast();
    const [isScanning, setIsScanning] = useState(false);

    async function scan(file: File): Promise<void> {
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
            onScanned(await billService.scanReceipt(file));
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Não foi possível ler a nota fiscal';

            if (isRetryableError(error)) {
                toast.error(message, RETRY_TOAST_DURATION, {
                    label: 'Tentar de novo',
                    onClick: () => {
                        void scan(file);
                    },
                });
            } else {
                toast.error(message);
            }
        } finally {
            setIsScanning(false);
        }
    }

    return { isScanning, scan };
}
