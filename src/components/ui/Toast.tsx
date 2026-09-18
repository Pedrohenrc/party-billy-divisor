import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    onClose: () => void;
}

const icons: Record<ToastType, string> = {
    success: '✓',
    error: '!',
    info: 'i',
};

export function Toast({ message, type, duration = 4000, onClose }: ToastProps) {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onClose, 200);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast toast-${type}${isExiting ? ' is-exiting' : ''}`} role="alert">
            <span className="toast-icon" aria-hidden="true">
                {icons[type]}
            </span>

            <p className="toast-message">{message}</p>

            <button
                className="toast-close"
                type="button"
                onClick={() => {
                    setIsExiting(true);
                    setTimeout(onClose, 200);
                }}
                aria-label="Fechar"
            >
                &times;
            </button>
        </div>
    );
}
