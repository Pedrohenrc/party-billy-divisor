interface LoadingProps {
    label?: string;
    full?: boolean;
}

export function Loading({ label = 'Carregando...', full = false }: LoadingProps) {
    return (
        <div className={full ? 'loading loading-full' : 'loading'} role="status">
            <span className="loading-spinner" aria-hidden="true" />
            <span className="loading-label">{label}</span>
        </div>
    );
}
