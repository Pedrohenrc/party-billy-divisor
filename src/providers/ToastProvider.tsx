import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ToastContext } from './toast-context.ts';
import { Toast } from '../components/ui/Toast.tsx';
import type { ToastAction, ToastType } from '../components/ui/Toast.tsx';
import { setToastCallback } from '../utils/http-client.ts';

interface ToastData {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
    action?: ToastAction;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType, duration: number = 4000, action?: ToastAction) => {
            const id = Math.random().toString(36).substring(2, 9);

            setToasts((current) => [...current, { id, message, type, duration, action }]);
        },
        []
    );

    const success = useCallback(
        (message: string, duration?: number) => showToast(message, 'success', duration),
        [showToast]
    );

    const error = useCallback(
        (message: string, duration?: number, action?: ToastAction) =>
            showToast(message, 'error', duration, action),
        [showToast]
    );

    const info = useCallback(
        (message: string, duration?: number) => showToast(message, 'info', duration),
        [showToast]
    );

    // Conecta o http-client ao sistema de toasts.
    useEffect(() => {
        setToastCallback((message, type) => showToast(message, type));
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, success, error, info }}>
            {children}

            <div className="toast-container">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        action={toast.action}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}
