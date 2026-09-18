import { tokenManager } from './token-manager.ts';
import type { ApiResponse } from '../types/api.ts';

const API_BASE_URL =
    import.meta.env.VITE_API_URL ?? 'https://billy-divisor.onrender.com/api';

interface RequestConfig extends RequestInit {
    skipAuth?: boolean;
    skipToast?: boolean;
}

export interface HttpError extends Error {
    status?: number;
    code?: string | null;
    isHandled?: boolean;
    validation?: Record<string, string> | null;
}

type ToastCallback = (message: string, type: 'success' | 'error') => void;

let toastCallback: ToastCallback | null = null;
let unauthorizedCallback: (() => void) | null = null;

export const setToastCallback = (callback: ToastCallback) => {
    toastCallback = callback;
};

export const setUnauthorizedCallback = (callback: () => void) => {
    unauthorizedCallback = callback;
};

function buildError(
    message: string,
    status?: number,
    code?: string | null,
    validation?: Record<string, string> | null
): HttpError {
    const error = new Error(message) as HttpError;

    error.status = status;
    error.code = code ?? null;
    error.validation = validation ?? null;
    error.isHandled = true;

    return error;
}

class HttpClient {
    private async request<T>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<ApiResponse<T>> {
        const { skipAuth = false, skipToast = false, headers = {}, ...restConfig } = config;

        const url = `${API_BASE_URL}${endpoint}`;
        const accessToken = tokenManager.getAccessToken();

        const requestHeaders = new Headers(headers as HeadersInit);

        if (!requestHeaders.has('Content-Type')) {
            requestHeaders.set('Content-Type', 'application/json');
        }

        if (!skipAuth && accessToken) {
            requestHeaders.set('Authorization', `Bearer ${accessToken}`);
        }

        let response: Response;

        try {
            response = await fetch(url, {
                ...restConfig,
                headers: requestHeaders,
            });
        } catch {
            if (!skipToast && toastCallback) {
                toastCallback('Erro de conexão. Tente novamente.', 'error');
            }

            throw buildError('Erro de conexão. Tente novamente.');
        }

        // A API não tem refresh token: sessão expirada = voltar para o login.
        if (response.status === 401 && !skipAuth) {
            tokenManager.clearTokens();

            if (unauthorizedCallback) {
                unauthorizedCallback();
            }

            throw buildError('Sua sessão expirou. Faça login novamente.', 401, 'UNAUTHORIZED');
        }

        let data: ApiResponse<T> | null;

        try {
            data = (await response.json()) as ApiResponse<T>;
        } catch {
            data = null;
        }

        if (!response.ok) {
            const errorMessage = data?.error || 'Ocorreu um erro inesperado';

            const validation =
                data?.code === 'VALIDATION_ERROR' && data.data
                    ? (data.data as unknown as Record<string, string>)
                    : null;

            if (!skipToast && toastCallback) {
                toastCallback(errorMessage, 'error');
            }

            throw buildError(errorMessage, response.status, data?.code, validation);
        }

        if (!data) {
            throw buildError('Resposta inválida da API', response.status);
        }

        if (!skipToast && data.message && toastCallback && restConfig.method !== 'GET') {
            toastCallback(data.message, 'success');
        }

        return data;
    }

    async get<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'GET', skipToast: true });
    }

    async post<T>(
        endpoint: string,
        body?: unknown,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async patch<T>(
        endpoint: string,
        body?: unknown,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async put<T>(
        endpoint: string,
        body?: unknown,
        config?: RequestConfig
    ): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, {
            ...config,
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    async delete<T>(endpoint: string, config?: RequestConfig): Promise<ApiResponse<T>> {
        return this.request<T>(endpoint, { ...config, method: 'DELETE' });
    }
}

export const httpClient = new HttpClient();
