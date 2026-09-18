export interface ApiResponse<T> {
    success_bool: boolean;
    data?: T | null;
    message?: string | null;
    error?: string | null;
    code?: string | null;
    timestamp?: string;
}

export type ValidationErrors = Record<string, string>;
