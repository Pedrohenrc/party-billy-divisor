import { useContext } from 'react';
import { AuthContext } from '../providers/auth-context.ts';
import type { AuthContextData } from '../providers/auth-context.ts';

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
