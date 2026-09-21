import { createContext } from 'react';
import type { ToastAction, ToastType } from '../components/ui/Toast.tsx';

export interface ToastContextData {
    showToast: (
        message: string,
        type: ToastType,
        duration?: number,
        action?: ToastAction
    ) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number, action?: ToastAction) => void;
    info: (message: string, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextData | null>(null);
