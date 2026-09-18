import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { ToastContext } from './toast-context.ts';
import { Toast } from '../components/ui/Toast.tsx';
import type { ToastType } from '../components/ui/Toast.tsx';
import { setToastCallback } from '../utils/http-client.ts';

interface ToastData {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback(
        (message: string, type: ToastType, duration: number = 4000) => {
            const id = Math.random().toString(36).substring(2, 9);

            setToasts((current) => [...current, { id, message, type, duration }]);
        },
        []
    );

    const success = useCallback(
        (message: string, duration?: number) => showToast(message, 'success', duration),
        [showToast]
    );

    const error = useCallback(
        (message: string, duration?: number) => showToast(message, 'error', duration),
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
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}
