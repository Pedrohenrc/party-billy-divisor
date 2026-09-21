import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastAction {
    label: string;
    onClick: () => void;
}

export interface ToastProps {
    message: string;
    type: ToastType;
    duration?: number;
    action?: ToastAction;
    onClose: () => void;
}

const icons: Record<ToastType, string> = {
    success: '✓',
    error: '!',
    info: 'i',
};

export function Toast({ message, type, duration = 4000, action, onClose }: ToastProps) {
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

            {action && (
                <button
                    className="toast-action"
                    type="button"
                    onClick={() => {
                        action.onClick();
                        setIsExiting(true);
                        setTimeout(onClose, 200);
                    }}
                >
                    {action.label}
                </button>
            )}

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
