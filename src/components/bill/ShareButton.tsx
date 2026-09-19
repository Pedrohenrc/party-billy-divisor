import { useState } from 'react';
import { Button } from '../ui/Button.tsx';
import { Modal } from '../ui/Modal.tsx';
import { CopyIcon, MessageIcon, ShareIcon } from '../ui/icons.tsx';
import { useToast } from '../../hooks/useToast.ts';
import { formatShareText } from '../../utils/shareText.ts';
import type { ShareBillData } from '../../utils/shareText.ts';

interface ShareButtonProps {
    data: ShareBillData;
    disabled?: boolean;
    label?: string;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
}

export function ShareButton({
    data,
    disabled = false,
    label = 'Compartilhar',
    variant = 'secondary',
    size = 'md',
}: ShareButtonProps) {
    const [fallbackOpen, setFallbackOpen] = useState(false);
    const toast = useToast();

    async function handleShareClick() {
        const text = formatShareText(data);

        if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
            try {
                await navigator.share({ title: data.title, text });
                return;
            } catch (error) {
                // usuário cancelou o share nativo: não faz nada
                if (error instanceof Error && error.name === 'AbortError') {
                    return;
                }
                // qualquer outro erro (ex.: navegador sem suporte real) cai no menu manual
            }
        }

        setFallbackOpen(true);
    }

    function handleWhatsApp() {
        const text = formatShareText(data);
        const url = `https://wa.me/?text=${encodeURIComponent(text)}`;

        window.open(url, '_blank', 'noopener,noreferrer');
        setFallbackOpen(false);
    }

    async function handleCopy() {
        const text = formatShareText(data);

        try {
            await navigator.clipboard.writeText(text);
            toast.success('Texto copiado! Já pode colar no WhatsApp.');
            setFallbackOpen(false);
        } catch {
            toast.error('Não foi possível copiar o texto.');
        }
    }

    return (
        <>
            <Button
                type="button"
                variant={variant}
                size={size}
                disabled={disabled}
                onClick={handleShareClick}
            >
                <span className="btn-icon">
                    <ShareIcon />
                </span>{' '}
                {label}
            </Button>

            <Modal
                open={fallbackOpen}
                title="Compartilhar conta"
                onClose={() => setFallbackOpen(false)}
            >
                <div className="share-options">
                    <button type="button" className="share-option" onClick={handleWhatsApp}>
                        <span className="share-option-icon">
                            <MessageIcon size={20} />
                        </span>
                        <span>Compartilhar no WhatsApp</span>
                    </button>

                    <button type="button" className="share-option" onClick={handleCopy}>
                        <span className="share-option-icon">
                            <CopyIcon size={20} />
                        </span>
                        <span>Copiar texto</span>
                    </button>
                </div>
            </Modal>
        </>
    );
}
