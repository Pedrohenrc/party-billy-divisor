import { createContext } from 'react';
import type { ToastType } from '../components/ui/Toast.tsx';

export interface ToastContextData {
    showToast: (message: string, type: ToastType, duration?: number) => void;
    success: (message: string, duration?: number) => void;
    error: (message: string, duration?: number) => void;
    info: (message: string, duration?: number) => void;
}

export const ToastContext = createContext<ToastContextData | null>(null);
