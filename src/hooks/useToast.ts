import { useContext } from 'react';
import { ToastContext } from '../providers/toast-context.ts';
import type { ToastContextData } from '../providers/toast-context.ts';

export function useToast(): ToastContextData {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
}
